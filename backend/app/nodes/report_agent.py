from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from app.state import MedicalState
import os
from datetime import datetime


def report_node(state: MedicalState) -> dict:
    """Report Agent : génère le rapport final structuré."""

    print("[ReportAgent] Génération du rapport final...")

    llm = ChatOllama(
        model=os.getenv("OLLAMA_MODEL", "llama3.2"),
        base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        temperature=0.2,
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", """Tu es un assistant médical administratif.
        Génère un RAPPORT FINAL STRUCTURÉ à partir des informations fournies.
        
        Le rapport doit contenir ces sections :
        1. INFORMATIONS DE LA CONSULTATION (date, référence)
        2. CAS PATIENT INITIAL
        3. SYNTHÈSE CLINIQUE PRÉLIMINAIRE
        4. RECOMMANDATIONS INTERMÉDIAIRES
        5. TRAITEMENT / CONDUITE À TENIR (médecin)
        6. CONCLUSION
        
        OBLIGATOIRE en bas du rapport :
        "⚠️ Ce système ne remplace pas une consultation médicale. 
        Ce document est un support d'orientation clinique préliminaire."
        """),
        ("human", f"""
        Date : {datetime.now().strftime('%d/%m/%Y à %H:%M')}
        
        Cas initial : {state.get('patient_case', 'Non précisé')}
        
        Synthèse clinique : {state.get('diagnostic_summary', '')}
        
        Recommandations intermédiaires : {state.get('interim_care', '')}
        
        Traitement / conduite médecin : {state.get('physician_treatment', '')}
        
        Génère le rapport final structuré :
        """)
    ])

    chain = prompt | llm
    response = chain.invoke({})
    final_report = response.content.strip()

    print("[ReportAgent] Rapport généré ✓")

    return {
        "final_report": final_report,
        "awaiting_physician": False,
    }