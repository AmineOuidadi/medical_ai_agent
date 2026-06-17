import React, { useState } from "react";
import { AppStep } from "../types";
import { startConsultation, submitAnswer, submitPhysicianReview } from "../services/api";
import QuestionCard from "../components/QuestionCard";
import PhysicianPanel from "../components/PhysicianPanel";
import ReportView from "../components/ReportView";

export default function ConsultationPage() {
  const [step, setStep] = useState<AppStep>("home");
  const [patientCase, setPatientCase] = useState("");
  const [threadId, setThreadId] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [diagnosticSummary, setDiagnosticSummary] = useState("");
  const [interimCare, setInterimCare] = useState("");
  const [finalReport, setFinalReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Écran 1 : Démarrer la consultation ──────────────────────────
  const handleStart = async () => {
    if (!patientCase.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await startConsultation(patientCase);
      setThreadId(data.thread_id);
      setCurrentQuestion(data.current_question);
      setStep("questions");
    } catch {
      setError("Impossible de démarrer la consultation. Vérifiez que l'API tourne.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Écran 2 : Répondre aux questions ───────────────────────────
  const handleAnswer = async (answer: string) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await submitAnswer(threadId, answer);
      setQuestionNumber(data.question_count + 1);

      if (data.awaiting_physician) {
        setDiagnosticSummary(data.diagnostic_summary || "");
        setInterimCare(data.interim_care || "");
        setStep("physician");
      } else if (data.current_question) {
        setCurrentQuestion(data.current_question);
      }
    } catch {
      setError("Erreur lors de l'envoi de la réponse.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Écran 3 : Validation médecin ────────────────────────────────
  const handlePhysicianSubmit = async (treatment: string) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await submitPhysicianReview(threadId, treatment);
      if (data.final_report) {
        setFinalReport(data.final_report);
        setStep("report");
      }
    } catch {
      setError("Erreur lors de la validation médecin.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Reset ────────────────────────────────────────────────────────
  const handleReset = () => {
    setStep("home");
    setPatientCase("");
    setThreadId("");
    setCurrentQuestion("");
    setQuestionNumber(1);
    setDiagnosticSummary("");
    setInterimCare("");
    setFinalReport("");
    setError("");
  };

  // ── Rendu ─────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <span style={styles.logo}>🏥</span>
        <div>
          <h1 style={styles.headerTitle}>Système d'Orientation Clinique</h1>
          <p style={styles.headerSub}>
            Support multi-agents — exercice académique
          </p>
        </div>
        {/* Stepper */}
        <div style={styles.stepper}>
          {["Cas patient", "Questions", "Médecin", "Rapport"].map((label, i) => {
            const stepKeys: AppStep[] = ["home", "questions", "physician", "report"];
            const active = step === stepKeys[i];
            const done =
              stepKeys.indexOf(step) > i;
            return (
              <div key={label} style={styles.stepItem}>
                <div
                  style={{
                    ...styles.stepDot,
                    background: done ? "#10b981" : active ? "#3b82f6" : "#e2e8f0",
                    color: done || active ? "#fff" : "#94a3b8",
                  }}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span
                  style={{
                    ...styles.stepLabel,
                    color: active ? "#3b82f6" : done ? "#10b981" : "#94a3b8",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </header>

      {/* Contenu principal */}
      <main style={styles.main}>
        {error && <div style={styles.error}>{error}</div>}

        {/* Écran 1 */}
        {step === "home" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Décrivez votre cas</h2>
            <p style={styles.cardSub}>
              Décrivez brièvement vos symptômes principaux pour commencer
              l'orientation clinique préliminaire.
            </p>
            <textarea
              style={styles.textarea}
              value={patientCase}
              onChange={(e) => setPatientCase(e.target.value)}
              placeholder="Ex: Je ressens une douleur à la gorge et de la fièvre depuis 2 jours..."
              rows={5}
            />
            <button
              style={{
                ...styles.button,
                opacity: isLoading || !patientCase.trim() ? 0.6 : 1,
              }}
              onClick={handleStart}
              disabled={isLoading || !patientCase.trim()}
            >
              {isLoading ? "Démarrage..." : "Commencer la consultation →"}
            </button>
            <p style={styles.disclaimer}>
              ⚠️ Ce système est un exercice académique et ne remplace pas une
              consultation médicale.
            </p>
          </div>
        )}

        {/* Écran 2 */}
        {step === "questions" && (
          <QuestionCard
            question={currentQuestion}
            questionNumber={questionNumber}
            totalQuestions={5}
            onSubmit={handleAnswer}
            isLoading={isLoading}
          />
        )}

        {/* Écran 3 */}
        {step === "physician" && (
          <PhysicianPanel
            diagnosticSummary={diagnosticSummary}
            interimCare={interimCare}
            onSubmit={handlePhysicianSubmit}
            isLoading={isLoading}
          />
        )}

        {/* Écran 4 */}
        {step === "report" && (
          <ReportView report={finalReport} onNewConsultation={handleReset} />
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "20px 40px",
    background: "#fff",
    boxShadow: "0 1px 12px rgba(0,0,0,0.07)",
    flexWrap: "wrap",
  },
  logo: { fontSize: 36 },
  headerTitle: { fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 },
  headerSub: { fontSize: 13, color: "#64748b", margin: "2px 0 0" },
  stepper: {
    display: "flex",
    gap: 24,
    marginLeft: "auto",
    alignItems: "center",
  },
  stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    transition: "all 0.3s",
  },
  stepLabel: { fontSize: 11, fontWeight: 500, transition: "color 0.3s" },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 24px",
  },
  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: "12px 20px",
    color: "#dc2626",
    marginBottom: 24,
    maxWidth: 640,
    width: "100%",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 36,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    maxWidth: 640,
    width: "100%",
  },
  cardTitle: { fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 8 },
  cardSub: { color: "#64748b", fontSize: 15, marginBottom: 24, lineHeight: 1.6 },
  textarea: {
    width: "100%",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    padding: "14px 16px",
    fontSize: 15,
    color: "#334155",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    lineHeight: 1.6,
  },
  button: {
    marginTop: 16,
    width: "100%",
    padding: "15px 0",
    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  disclaimer: {
    textAlign: "center",
    color: "#f59e0b",
    fontSize: 12,
    marginTop: 16,
    fontWeight: 500,
  },
};