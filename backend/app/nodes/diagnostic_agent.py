from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from app.state import MedicalState
from app.tools.patient_tools import CLINICAL_QUESTIONS
from app.tools.care_tools import recommend_interim_care
import os


def diagnostic_node(state: MedicalState) -> dict:
    """
    Diagnostic Agent :
    - Pose les 5 questions au patient (une par passage)
    - Produit la synthèse clinique après 5 réponses
    - Génère la recommandation intermédiaire
    """

    llm = ChatOllama(
        model=os.getenv("OLLAMA_MODEL", "llama3.2"),
        base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        temperature=0.3,
    )

    question_count = state.get("question_count", 0)
    patient_answers = state.get("patient_answers", [])

    # -- Phase 1 : encore des questions à poser --
    if question_count < 5:
        current_q = CLINICAL_QUESTIONS[question_count]
        print(f"[DiagnosticAgent] Question {question_count + 1}/5 : {current_q}")
        return {
            "current_question": current_q,
            "awaiting_patient": True,
        }

    # -- Phase 2 : toutes les réponses reçues → produire la synthèse --
    print("[DiagnosticAgent] Production de la synthèse clinique...")

    answers_text = "\n".join([
        f"Q{i+1}: {CLINICAL_QUESTIONS[i]}\nR: {ans}"
        for i, ans in enumerate(patient_answers)
    ])

    prompt = ChatPromptTemplate.from_messages([
        ("system", """Tu es un assistant clinique. 
        À partir des réponses du patient, produis une SYNTHÈSE CLINIQUE PRÉLIMINAIRE.
        
        IMPORTANT :
        - Ne pose PAS de diagnostic définitif
        - Utilise les termes : 'orientation clinique préliminaire', 'synthèse clinique'
        - Reste factuel et prudent
        - Identifie les symptômes principaux et les éléments à surveiller
        - Mentionne si des 'red flags' (signaux d'alarme) sont présents
        - Format : paragraphe structuré de 150-200 mots maximum
        """),
        ("human", f"""Cas patient initial : {state.get('patient_case', 'Non précisé')}
        
        Réponses aux questions cliniques :
        {answers_text}
        
        Produis la synthèse clinique préliminaire :""")
    ])

    chain = prompt | llm
    response = chain.invoke({})
    diagnostic_summary = response.content.strip()

    # Générer la recommandation intermédiaire
    interim = recommend_interim_care.invoke(
        {"symptoms_summary": diagnostic_summary}
    )

    print("[DiagnosticAgent] Synthèse produite ✓")

    return {
        "diagnostic_summary": diagnostic_summary,
        "interim_care": interim,
        "awaiting_patient": False,
    }