from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from app.state import MedicalState
import os

MEMBERS = ["diagnostic_agent", "physician_review", "report_agent"]

SYSTEM_PROMPT = """Tu es le superviseur d'un système d'orientation clinique préliminaire.
Ton rôle est UNIQUEMENT de décider quelle est la prochaine étape du workflow.

Règles de routage strictes :
1. Si question_count < 5 ET pas de diagnostic_summary → diagnostic_agent
2. Si question_count == 5 ET pas de diagnostic_summary → diagnostic_agent (pour produire la synthèse)
3. Si diagnostic_summary existe ET pas de physician_treatment → physician_review
4. Si physician_treatment existe ET pas de final_report → report_agent
5. Si final_report existe → FINISH

Réponds avec UN SEUL MOT parmi : diagnostic_agent, physician_review, report_agent, FINISH
"""


def supervisor_node(state: MedicalState) -> dict:
    """Nœud Supervisor : décide du prochain nœud selon l'état."""

    llm = ChatOllama(
        model=os.getenv("OLLAMA_MODEL", "llama3.2"),
        base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        temperature=0,
    )

    context = f"""
    État de la consultation :
    - Questions posées : {state.get('question_count', 0)}/5
    - Synthèse produite : {'OUI' if state.get('diagnostic_summary') else 'NON'}
    - Recommandation intermédiaire : {'OUI' if state.get('interim_care') else 'NON'}
    - Validation médecin : {'OUI' if state.get('physician_treatment') else 'NON'}
    - Rapport final : {'OUI' if state.get('final_report') else 'NON'}
    """

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", context + "\nQuelle est la prochaine étape ?")
    ])

    chain = prompt | llm
    response = chain.invoke({})
    next_step = response.content.strip().lower()

    # Sécurité : valider la réponse
    valid = MEMBERS + ["finish"]
    if next_step not in valid:
        # Logique de fallback déterministe
        if state.get('final_report'):
            next_step = "FINISH"
        elif state.get('physician_treatment'):
            next_step = "report_agent"
        elif state.get('diagnostic_summary'):
            next_step = "physician_review"
        else:
            next_step = "diagnostic_agent"
    else:
        next_step = next_step.replace("finish", "FINISH")

    print(f"[Supervisor] → {next_step}")
    return {"next": next_step}