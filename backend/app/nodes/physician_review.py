from app.state import MedicalState


def physician_review_node(state: MedicalState) -> dict:
    """
    Human-in-the-Loop : interruption pour le médecin traitant.
    Ce nœud met le graphe en pause — le médecin répond via l'API.
    LangGraph reprend automatiquement quand physician_treatment est fourni.
    """
    print("[PhysicianReview] ⏸ En attente de la validation du médecin...")

    return {
        "awaiting_physician": True,
    }