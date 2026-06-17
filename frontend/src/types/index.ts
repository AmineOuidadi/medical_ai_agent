export interface ConsultationStart {
  thread_id: string;
  current_question: string;
  awaiting_patient: boolean;
  status: string;
}

export interface AnswerResponse {
  thread_id: string;
  question_count: number;
  current_question?: string;
  awaiting_patient: boolean;
  awaiting_physician: boolean;
  diagnostic_summary?: string;
  interim_care?: string;
  status: string;
}

export interface PhysicianResponse {
  thread_id: string;
  final_report?: string;
  status: string;
}

export type AppStep =
  | "home"
  | "questions"
  | "physician"
  | "report";