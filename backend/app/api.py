from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid
from dotenv import load_dotenv

load_dotenv()

from app.graph import medical_graph

app = FastAPI(title="Système Multi-Agents Médical", version="1.0.0")

# CORS pour le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Modèles de données ────────────────────────────────────────────

class StartConsultationRequest(BaseModel):
    patient_case: str  # description initiale du patient

class PatientAnswerRequest(BaseModel):
    answer: str        # réponse du patient à la question courante

class PhysicianReviewRequest(BaseModel):
    treatment: str     # traitement / conduite à tenir du médecin


# ── Endpoints ────────────────────────────────────────────────────

@app.post("/consultation/start")
async def start_consultation(req: StartConsultationRequest):
    """Démarre une nouvelle consultation."""
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = {
        "patient_case": req.patient_case,
        "question_count": 0,
        "patient_answers": [],
        "thread_id": thread_id,
    }

    result = medical_graph.invoke(initial_state, config)

    return {
        "thread_id": thread_id,
        "current_question": result.get("current_question"),
        "awaiting_patient": result.get("awaiting_patient", False),
        "status": "in_progress"
    }


@app.post("/consultation/{thread_id}/answer")
async def submit_answer(thread_id: str, req: PatientAnswerRequest):
    """Soumet la réponse du patient à la question courante."""
    config = {"configurable": {"thread_id": thread_id}}

    # Récupérer l'état actuel
    current_state = medical_graph.get_state(config)
    if not current_state:
        raise HTTPException(status_code=404, detail="Consultation introuvable")

    values = current_state.values
    question_count = values.get("question_count", 0)
    patient_answers = values.get("patient_answers", [])

    # Ajouter la réponse et incrémenter le compteur
    patient_answers.append(req.answer)
    new_count = question_count + 1

    # Mettre à jour l'état et continuer
    medical_graph.update_state(config, {
        "patient_answers": patient_answers,
        "question_count": new_count,
        "awaiting_patient": False,
    })

    result = medical_graph.invoke(None, config)

    return {
        "thread_id": thread_id,
        "question_count": new_count,
        "current_question": result.get("current_question"),
        "awaiting_patient": result.get("awaiting_patient", False),
        "awaiting_physician": result.get("awaiting_physician", False),
        "diagnostic_summary": result.get("diagnostic_summary"),
        "interim_care": result.get("interim_care"),
        "status": "awaiting_physician" if result.get("awaiting_physician") else "in_progress"
    }


@app.post("/consultation/{thread_id}/physician-review")
async def physician_review(thread_id: str, req: PhysicianReviewRequest):
    """Soumet la validation et le traitement du médecin."""
    config = {"configurable": {"thread_id": thread_id}}

    medical_graph.update_state(config, {
        "physician_treatment": req.treatment,
        "awaiting_physician": False,
    })

    result = medical_graph.invoke(None, config)

    return {
        "thread_id": thread_id,
        "final_report": result.get("final_report"),
        "status": "completed" if result.get("final_report") else "in_progress"
    }


@app.get("/consultation/{thread_id}")
async def get_consultation(thread_id: str):
    """Récupère l'état complet d'une consultation."""
    config = {"configurable": {"thread_id": thread_id}}
    state = medical_graph.get_state(config)
    if not state:
        raise HTTPException(status_code=404, detail="Consultation introuvable")
    return state.values


@app.get("/consultation/{thread_id}/report")
async def get_report(thread_id: str):
    """Récupère le rapport final d'une consultation."""
    config = {"configurable": {"thread_id": thread_id}}
    state = medical_graph.get_state(config)
    if not state or not state.values.get("final_report"):
        raise HTTPException(status_code=404, detail="Rapport non disponible")
    return {"report": state.values["final_report"]}


@app.get("/health")
async def health():
    return {"status": "ok", "model": "llama3.2"}