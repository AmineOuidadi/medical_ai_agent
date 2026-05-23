from langchain_core.tools import tool


@tool
def recommend_interim_care(symptoms_summary: str) -> str:
    """
    Génère une recommandation de soins intermédiaire prudente
    basée sur le résumé des symptômes.
    """
    # Recommandations générales prudentes (non diagnostiques)
    base_recommendations = """
    RECOMMANDATIONS INTERMÉDIAIRES GÉNÉRALES :
    
    • Repos suffisant et hydratation adéquate (1.5-2L d'eau par jour)
    • Surveillance de l'évolution des symptômes
    • Consulter rapidement un médecin en cas d'aggravation
    • Éviter l'automédication sans avis médical
    
    ⚠️ Ces recommandations sont générales et ne remplacent pas
    une consultation médicale professionnelle.
    """
    return base_recommendations.strip()