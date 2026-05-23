from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from app.state import MedicalState
from app.nodes.supervisor import supervisor_node
from app.nodes.diagnostic_agent import diagnostic_node
from app.nodes.physician_review import physician_review_node
from app.nodes.report_agent import report_node


def build_graph():
    """Construit et compile le graphe LangGraph."""

    # Mémoire pour persister l'état entre les appels (Human-in-the-Loop)
    memory = MemorySaver()

    graph = StateGraph(MedicalState)

    # ── Ajout des nœuds ──────────────────────────────────────────
    graph.add_node("supervisor", supervisor_node)
    graph.add_node("diagnostic_agent", diagnostic_node)
    graph.add_node("physician_review", physician_review_node)
    graph.add_node("report_agent", report_node)

    # ── Point d'entrée ───────────────────────────────────────────
    graph.set_entry_point("supervisor")

    # ── Routage conditionnel depuis le Supervisor ─────────────────
    graph.add_conditional_edges(
        "supervisor",
        lambda state: state.get("next", "diagnostic_agent"),
        {
            "diagnostic_agent": "diagnostic_agent",
            "physician_review": "physician_review",
            "report_agent": "report_agent",
            "FINISH": END,
        }
    )

    # ── Retour au Supervisor après chaque agent ───────────────────
    graph.add_edge("diagnostic_agent", "supervisor")
    graph.add_edge("report_agent", "supervisor")

    # ── physician_review s'interrompt (interrupt_before) ─────────
    # LangGraph reprend depuis supervisor quand on appelle resume
    graph.add_edge("physician_review", "supervisor")

    # Compilation avec checkpointer (nécessaire pour HITL)
    compiled = graph.compile(
        checkpointer=memory,
        interrupt_before=["physician_review"],  # pause avant médecin
    )

    return compiled


# Instance globale du graphe
medical_graph = build_graph()