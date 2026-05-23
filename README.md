# Medical_AI_Agent

## Project Overview

Medical_AI_Agent is an AI-driven medical assistant backend developed using FastAPI and Python. The backend is currently completed and functional, providing the core API, modular agent orchestration, and support services required for a medical assistance workflow.

## Current Advancement Status

- Backend development: Completed and operational.
- Core features: Implemented and validated.
- Service readiness: Backend is functional for integration testing and deployment.
- Frontend: Present in the workspace but not the focus of this progress report.

## Backend Completed Features

- FastAPI application with structured routing and dependency handling.
- Modular AI agents for diagnostics, reporting, physician review, and supervision.
- Tool integration for patient management, care orchestration, and MCP communication.
- Graph-based state and workflow management.
- API endpoints for service interaction and agent coordination.

## Technologies Used

- Python 3.x
- FastAPI
- Pydantic
- Uvicorn (for application serving)
- JSON-based state and configuration management
- GitHub Classroom compatible project layout

## Architecture and Modules Implemented

- `backend/app/api.py`: FastAPI route definitions and API entry points.
- `backend/app/graph.py`: Graph workflow and state handling logic.
- `backend/app/state.py`: State management for agent interactions.
- `backend/app/nodes/`: Modular AI agent components:
  - `diagnostic_agent.py`
  - `physician_review.py`
  - `report_agent.py`
  - `supervisor.py`
- `backend/app/tools/`: Supporting tools and utilities:
  - `care_tools.py`
  - `patient_tools.py`
  - `mcp_client.py`
- `backend/mcp_server/server.py`: MCP server implementation and communication support.

## APIs Developed

- RESTful endpoints exposed through `backend/app/api.py`.
- Endpoints support agent invocation, workflow progression, and data exchange.
- API design is consistent with FastAPI conventions for request validation and response modeling.

## Database Integration

- Current implementation uses JSON and in-memory state management.
- No external database is integrated at this stage.
- Data persistence is managed through application state and configuration files.

## Authentication System

- Authentication is not yet implemented in the backend.
- The current focus remains on core agent orchestration and API functionality.
- Authentication may be introduced in a later phase for secure service access.

## Error Handling

- API-level error handling is provided through FastAPI exception handling.
- Input validation and request validation use Pydantic models.
- Module-level safeguards support consistent failure reporting and traceability.

## Testing Status

- Backend functionality has been manually validated through development workflow tests.
- Automated unit tests are not currently included in the repository.
- The system is ready for formal test case development and integration testing.

## Remaining Tasks / Next Steps

- Add authentication and authorization support.
- Introduce persistent database integration for patient and workflow data.
- Implement automated unit and integration tests.
- Expand API documentation and OpenAPI coverage.
- Finalize frontend integration if required for end-to-end validation.

## Project Structure

- `backend/`
  - `app/`
    - `__init__.py`
    - `api.py`
    - `graph.py`
    - `state.py`
    - `nodes/`
      - `diagnostic_agent.py`
      - `physician_review.py`
      - `report_agent.py`
      - `supervisor.py`
    - `tools/`
      - `care_tools.py`
      - `mcp_client.py`
      - `patient_tools.py`
  - `mcp_server/`
    - `server.py`
    - `data/`
  - `langgraph.json`
  - `requirements.txt`
- `frontend/`
- `README.md`

## Installation and Execution

1. Clone the repository.
2. Create and activate a Python virtual environment.
3. Install dependencies:

```bash
pip install -r backend/requirements.txt
```

4. Run the FastAPI backend from the project root:

```bash
uvicorn backend.app.api:app --reload --host 0.0.0.0 --port 8000
```

5. Access the API documentation at:

```text
http://127.0.0.1:8000/docs
```

## Notes

- This project report is focused on current backend progress.
- The backend is complete and functional, suitable for academic submission and further extension.
