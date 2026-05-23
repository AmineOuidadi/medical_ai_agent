from langchain_core.tools import tool
from app.state import MedicalState


# Les 5 questions cliniques standard
CLINICAL_QUESTIONS = [
    "Quels sont vos symptômes principaux et depuis combien de temps durent-ils ?",
    "Sur une échelle de 1 à 10, quelle est l'intensité de vos symptômes ?",
    "Avez-vous de la fièvre, des frissons ou d'autres symptômes associés ?",
    "Avez-vous des antécédents médicaux ou des allergies connues ?",
    "Prenez-vous actuellement des médicaments ou avez-vous consulté récemment ?",
]


@tool
def ask_patient_question(question_index: int) -> str:
    """Retourne la question clinique à poser au patient selon son index (0-4)."""
    if 0 <= question_index < len(CLINICAL_QUESTIONS):
        return CLINICAL_QUESTIONS[question_index]
    return "Avez-vous autre chose à signaler ?"


def get_next_question(state: MedicalState) -> str:
    """Retourne la prochaine question à poser selon l'état."""
    count = state.get("question_count", 0)
    if count < len(CLINICAL_QUESTIONS):
        return CLINICAL_QUESTIONS[count]
    return None