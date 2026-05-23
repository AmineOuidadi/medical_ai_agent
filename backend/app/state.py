from typing import Annotated, Optional
from typing_extensions import TypedDict, Literal
from langgraph.graph.message import add_messages


class MedicalState(TypedDict, total=False):
    # Historique des messages (géré automatiquement par LangGraph)
    messages: Annotated[list, add_messages]

    # Routage : le Supervisor écrit ici la prochaine étape
    next: Literal[
        "diagnostic_agent",
        "physician_review",
        "report_agent",
        "FINISH"
    ]

    # Données de la consultation
    patient_case: str          # cas initial saisi par le patient
    question_count: int        # nombre de questions posées (max 5)
    patient_answers: list      # réponses du patient aux 5 questions
    diagnostic_summary: str    # synthèse clinique préliminaire
    interim_care: str          # recommandation intermédiaire prudente
    physician_treatment: str   # traitement proposé par le médecin
    final_report: str          # rapport final structuré

    # Contrôle du flux
    awaiting_patient: bool     # True = on attend une réponse patient
    awaiting_physician: bool   # True = on attend la validation médecin
    current_question: str      # question actuellement posée au patient
    thread_id: str             # identifiant de la session