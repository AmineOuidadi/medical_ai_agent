# Medical_AI_Agent

## 1. Project Title

Medical_AI_Agent

## 2. Project Overview

Medical_AI_Agent is a full-stack AI medical assistant application developed for university-level engineering submission. The system integrates a Python-based backend, a React frontend, and an AI-powered multi-agent workflow to support patient intake, clinical question management, physician review, and final report generation.

## 3. Problem Statement

Clinical triage can be fragmented and time-consuming, and clinicians need tools that help collect symptom data, structure clinical reasoning, and preserve human oversight. This project addresses those challenges with an AI-assisted workflow that combines automation with physician validation.

## 4. Objectives

- Deliver a complete full-stack medical assistant system.
- Implement a REST API backend with multi-agent AI orchestration.
- Build a responsive frontend for patient interaction and clinician validation.
- Demonstrate integration of LangChain, LangGraph, Ollama, and MCP.
- Produce a professional academic report and maintainable project structure.

## 5. System Architecture

The system consists of three core components:

- **Frontend**: React application for patient case submission, question flow, physician review, and final report display.
- **Backend**: FastAPI service that exposes clinical workflow endpoints and manages consultation state.
- **AI Agents**: A multi-agent workflow powered by LangGraph and LangChain, with Ollama providing the language model.

The architecture supports a sequential medico-technical flow:
1. Patient case intake through the frontend.
2. Diagnostic question generation and response collection.
3. Physician review and treatment validation.
4. Final structured report generation.

## 6. Technologies Used

### Backend
- Python
- FastAPI
- LangChain
- LangGraph
- Ollama
- MCP server
- Pydantic
- Uvicorn

### Frontend
- React
- JavaScript / TypeScript
- HTML
- CSS
- Axios

## 7. Project Structure

`	ext
Medical_AI_Agent/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── api.py
│   │   ├── graph.py
│   │   ├── state.py
│   │   ├── nodes/
│   │   │   ├── diagnostic_agent.py
│   │   │   ├── physician_review.py
│   │   │   ├── report_agent.py
│   │   │   └── supervisor.py
│   │   └── tools/
│   │       ├── care_tools.py
│   │       ├── mcp_client.py
│   │       └── patient_tools.py
│   ├── mcp_server/
│   │   ├── server.py
│   │   └── data/
│   ├── langgraph.json
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.tsx
│       ├── pages/
│       │   └── ConsultationPage.tsx
│       ├── components/
│       │   ├── QuestionCard.tsx
│       │   ├── PhysicianPanel.tsx
│       │   └── ReportView.tsx
│       ├── services/
│       │   └── api.ts
│       └── types/
│           └── index.ts
└── README.md
`

## 8. Backend Description

The backend is implemented with FastAPI and serves as the central workflow manager. It exposes consultation endpoints and orchestrates an AI state graph with distinct agent nodes.

### Backend responsibilities
- Expose REST endpoints for consultation creation, patient answers, physician review, and report retrieval.
- Use LangGraph to construct a multi-node workflow with state persistence.
- Coordinate LangChain + Ollama to generate clinical summaries and final reports.
- Maintain session state across multiple HTTP requests using MCP memory persistence.

### Core backend modules
- ackend/app/api.py: API endpoint definitions and request handlers.
- ackend/app/graph.py: Graph construction and node routing using LangGraph.
- ackend/app/state.py: Consultation state model.
- ackend/app/nodes/: AI agent nodes for diagnostics, physician review, and reporting.
- ackend/app/tools/: Utility helpers for clinical questions, care recommendations, and MCP integration.

## 9. Frontend Description

The frontend is a React application that guides users through a clinical consultation workflow. It provides a modern and responsive interface for both patient and clinician interactions.

### Frontend functionality
- Patient case submission screen.
- Interactive question flow with answer submission.
- Physician review panel for clinical validation.
- Final report display with structured consultation output.

### Frontend components
- App.tsx: Application entry point.
- ConsultationPage.tsx: Main workflow page and state management.
- QuestionCard.tsx: Displays questions and captures patient input.
- PhysicianPanel.tsx: Presents clinical summary and treatment input.
- ReportView.tsx: Displays the generated final report.
- services/api.ts: Axios-based API client.
- 	ypes/index.ts: TypeScript interfaces for API responses.

## 10. AI Multi-Agent System Workflow

The AI workflow follows a clear multi-agent process:

1. **Supervisor Agent**
   - Evaluates consultation state and selects the next workflow node.
   - Routes execution to diagnostic questioning, physician review, or report generation.

2. **Diagnostic Agent**
   - Asks a fixed set of clinical questions.
   - Collects patient answers and generates a preliminary clinical summary.
   - Produces interim care guidance.

3. **Physician Review Node**
   - Pauses the workflow and waits for physician treatment input.
   - Ensures a human-in-the-loop validation step.

4. **Report Agent**
   - Builds a final structured medical report using the collected state.
   - Includes consultation metadata, summary, interim recommendations, physician treatment, and a disclaimer.

5. **State Persistence**
   - Uses MemorySaver to preserve consultation progress between API calls.
   - Enables a seamless multi-step frontend experience.

## 11. Features Implemented

- Full-stack consultation workflow.
- REST API for patient and physician interactions.
- AI-driven diagnostic summary generation.
- Human-in-the-loop physician review.
- Structured final report creation.
- Responsive React frontend.
- Session state persistence with MCP.
- Health monitoring endpoint.

## 12. Installation Guide

### Backend installation
1. Clone the repository:
   `ash
   git clone <repository-url>
   cd Medical_AI_Agent
   `
2. Create a Python virtual environment:
   `ash
   python -m venv .venv
   `
3. Activate the virtual environment:
   - PowerShell:
     `powershell
     .venv\Scripts\Activate.ps1
     `
   - Bash:
     `ash
     source .venv/Scripts/activate
     `
4. Install dependencies:
   `ash
   pip install -r backend/requirements.txt
   `
5. Configure environment variables in .env if needed:
   `	ext
   OLLAMA_MODEL=llama3.2
   OLLAMA_BASE_URL=http://localhost:11434
   `

### Frontend installation
1. Navigate to the frontend directory:
   `ash
   cd frontend
   `
2. Install dependencies:
   `ash
   npm install
   `

## 13. How to Run the Project

### Start the backend
From the project root:
`ash
uvicorn backend.app.api:app --reload --host 0.0.0.0 --port 8000
`

### Start the frontend
From rontend/:
`ash
npm start
`

### Access
- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs

## 14. API Endpoints

- POST /consultation/start
  - Start a new consultation session.
  - Request body: {  patient_case: ... }

- POST /consultation/{thread_id}/answer
  - Submit a patient answer.
  - Request body: { answer: ... }

- POST /consultation/{thread_id}/physician-review
  - Submit physician treatment validation.
  - Request body: { treatment: ... }

- GET /consultation/{thread_id}
  - Retrieve current consultation state.

- GET /consultation/{thread_id}/report
  - Retrieve the final structured report.

- GET /health
  - Check service status.

## 15. Screenshots

> Add actual screenshots under screenshots/ before final submission.

`markdown
![Patient Intake](screenshots/patient-intake.png)
![Question Flow](screenshots/question-flow.png)
![Physician Review](screenshots/physician-review.png)
![Final Report](screenshots/final-report.png)
`

## 16. Challenges Faced

- Building a stable multi-agent workflow with state persistence.
- Synchronizing frontend state with backend session lifecycle.
- Writing AI prompts that maintain clinical structure and safety.
- Ensuring modular code design across backend and frontend.

## 17. Future Improvements

- Add authentication and authorization.
- Integrate a persistent database for clinical records.
- Add automated backend and frontend tests.
- Introduce Docker deployment and cloud hosting support.
- Improve UX and accessibility on the frontend.
- Expand AI safety and medical validation layers.

## 18. Conclusion

Medical_AI_Agent provides a complete full-stack medical assistant solution suitable for academic evaluation. The project showcases modern backend architecture, responsive frontend design, and advanced AI workflow orchestration.

## 19. Author Information

- Author: [Ouidadi Mohammed-AMine]
- Institution: [Ecole Marocaine Des Sciences D'ingenieures (EMSI)]
- Project: Medical_AI_Agent
