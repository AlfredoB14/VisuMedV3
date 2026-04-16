import { Consultation, CreateConsultationPayload } from "../redux/consultations/types/Consultations.interface";
import {api} from "./instance";

const _consultationsService = {
  getConsultation: async (params?: { patientId?: string; doctorId?: string; status?: string }) => {
    const response = await api.get<Consultation[]>(`/consultations/`, { params });
    return response.data;
  },
  createConsultation: async (consultation: CreateConsultationPayload) => {
    const response = await api.post<Consultation>(`/consultations/`, consultation);
    return response.data;
  },
};

export default _consultationsService;
