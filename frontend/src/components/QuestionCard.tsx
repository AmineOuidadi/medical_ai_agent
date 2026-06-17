import React, { useState } from "react";

interface Props {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (answer: string) => void;
  isLoading: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
  isLoading,
}: Props) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer("");
    }
  };

  const progress = ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <div style={styles.card}>
      {/* Barre de progression */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      <div style={styles.badge}>
        Question {questionNumber} / {totalQuestions}
      </div>

      <p style={styles.question}>{question}</p>

      <textarea
        style={styles.textarea}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Décrivez votre réponse..."
        rows={4}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) handleSubmit();
        }}
      />

      <button
        style={{
          ...styles.button,
          opacity: isLoading || !answer.trim() ? 0.6 : 1,
        }}
        onClick={handleSubmit}
        disabled={isLoading || !answer.trim()}
      >
        {isLoading ? "Traitement en cours..." : "Répondre →"}
      </button>

      <p style={styles.hint}>Ctrl+Entrée pour valider</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 32,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    maxWidth: 640,
    width: "100%",
  },
  progressBar: {
    height: 6,
    background: "#e8f4ff",
    borderRadius: 99,
    marginBottom: 24,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
    borderRadius: 99,
    transition: "width 0.4s ease",
  },
  badge: {
    display: "inline-block",
    background: "#eff6ff",
    color: "#3b82f6",
    borderRadius: 99,
    padding: "4px 14px",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
  },
  question: {
    fontSize: 20,
    fontWeight: 600,
    color: "#1e293b",
    lineHeight: 1.5,
    marginBottom: 20,
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
    marginTop: 16,
    width: "100%",
    padding: "14px 0",
    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  hint: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 8,
  },
};