import axios from "axios";
import {
  ConsultationStart,
  AnswerResponse,
  PhysicianResponse,
} from "../types";

const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

export const startConsultation = (patientCase: string) =>
  API.post<ConsultationStart>("/consultation/start", {
    patient_case: patientCase,
  }).then((r) => r.data);

export const submitAnswer = (threadId: string, answer: string) =>
  API.post<AnswerResponse>(`/consultation/${threadId}/answer`, {
    answer,
  }).then((r) => r.data);

export const submitPhysicianReview = (threadId: string, treatment: string) =>
  API.post<PhysicianResponse>(`/consultation/${threadId}/physician-review`, {
    treatment,
  }).then((r) => r.data);