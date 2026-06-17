import React from "react";

interface Props {
  report: string;
  onNewConsultation: () => void;
}

export default function ReportView({ report, onNewConsultation }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    alert("Rapport copié !");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.icon}>📋</span>
        <div>
          <h2 style={styles.title}>Rapport Final</h2>
          <p style={styles.subtitle}>Consultation terminée</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.copyBtn} onClick={handleCopy}>
            📄 Copier
          </button>
          <button style={styles.printBtn} onClick={() => window.print()}>
            🖨️ Imprimer
          </button>
        </div>
      </div>

      <div style={styles.reportContent}>
        {report.split("\n").map((line, i) => (
          <p key={i} style={line.startsWith("#") ? styles.heading : styles.line}>
            {line}
          </p>
        ))}
      </div>

      <div style={styles.disclaimer}>
        ⚠️ Ce système ne remplace pas une consultation médicale. Ce document
        est un support d'orientation clinique préliminaire uniquement.
      </div>

      <button style={styles.newBtn} onClick={onNewConsultation}>
        + Nouvelle consultation
      </button>
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
    marginBottom: 24,
    paddingBottom: 20,
    borderBottom: "1px solid #f1f5f9",
  },
  icon: { fontSize: 36 },
  title: { fontSize: 22, fontWeight: 700, color: "#1e293b", margin: 0 },
  subtitle: { color: "#64748b", fontSize: 14, margin: "4px 0 0" },
  headerActions: { marginLeft: "auto", display: "flex", gap: 8 },
  copyBtn: {
    padding: "8px 16px",
    background: "#f1f5f9",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
  },
  printBtn: {
    padding: "8px 16px",
    background: "#f1f5f9",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
  },
  reportContent: {
    background: "#f8fafc",
    borderRadius: 10,
    padding: "20px 24px",
    marginBottom: 20,
    maxHeight: 420,
    overflowY: "auto",
  },
  heading: {
    fontWeight: 700,
    color: "#1e293b",
    fontSize: 16,
    margin: "12px 0 4px",
  },
  line: {
    color: "#334155",
    fontSize: 15,
    lineHeight: 1.7,
    margin: "2px 0",
  },
  disclaimer: {
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#92400e",
    fontSize: 13,
    marginBottom: 20,
  },
  newBtn: {
    width: "100%",
    padding: "14px 0",
    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
};