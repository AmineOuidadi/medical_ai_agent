import React, { useState } from "react";

interface Props {
  diagnosticSummary: string;
  interimCare: string;
  onSubmit: (treatment: string) => void;
  isLoading: boolean;
}

export default function PhysicianPanel({
  diagnosticSummary,
  interimCare,
  onSubmit,
  isLoading,
}: Props) {
  const [treatment, setTreatment] = useState("");

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.icon}>🩺</span>
        <div>
          <h2 style={styles.title}>Revue Médecin Traitant</h2>
          <p style={styles.subtitle}>
            Validation humaine requise avant le rapport final
          </p>
        </div>
      </div>

      {/* Synthèse clinique */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Synthèse clinique préliminaire</h3>
        <div style={styles.summaryBox}>
          <p style={styles.summaryText}>{diagnosticSummary}</p>
        </div>
      </div>

      {/* Recommandations intermédiaires */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recommandations intermédiaires</h3>
        <div style={{ ...styles.summaryBox, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
          <p style={styles.summaryText}>{interimCare}</p>
        </div>
      </div>

      {/* Traitement médecin */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          Votre traitement / conduite à tenir
        </h3>
        <textarea
          style={styles.textarea}
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          placeholder="Ex: Repos 48h, paracétamol 1g/6h si fièvre > 38.5°C, consultation si aggravation sous 72h..."
          rows={5}
        />
        <button
          style={{
            ...styles.button,
            opacity: isLoading || !treatment.trim() ? 0.6 : 1,
          }}
          onClick={() => treatment.trim() && onSubmit(treatment.trim())}
          disabled={isLoading || !treatment.trim()}
        >
          {isLoading ? "Génération du rapport..." : "✅ Valider et générer le rapport"}
        </button>
      </div>

      <p style={styles.disclaimer}>
        ⚠️ Ce système ne remplace pas une consultation médicale.
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: "#fff",
    borderRadius: 16,
    padding: 32,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    maxWidth: 720,
    width: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 28,
    paddingBottom: 20,
    borderBottom: "1px solid #f1f5f9",
  },
  icon: { fontSize: 40 },
  title: { fontSize: 22, fontWeight: 700, color: "#1e293b", margin: 0 },
  subtitle: { color: "#64748b", fontSize: 14, margin: "4px 0 0" },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 10,
  },
  summaryBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "16px 18px",
  },
  summaryText: {
    color: "#334155",
    fontSize: 15,
    lineHeight: 1.7,
    margin: 0,
    whiteSpace: "pre-line",
  },
  textarea: {
    width: "100%",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 15,
    color: "#334155",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  button: {
    marginTop: 14,
    width: "100%",
    padding: "14px 0",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
  disclaimer: {
    textAlign: "center",
    color: "#f59e0b",
    fontSize: 13,
    marginTop: 16,
    fontWeight: 500,
  },
};