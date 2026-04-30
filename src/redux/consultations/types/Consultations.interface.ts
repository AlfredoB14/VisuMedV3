export interface Consultation {
    id: string,
    patientId: string,
    doctorId: string,
    scheduledAt: string,
    status: string,
    createdAt: string,
}

export interface IConsultationUI {
    ui: IDoctorsState;
  }

export interface IDoctorsState {
  loading: boolean;
  error: string | null;
  consultations?: Consultation[];
  patientConsultation?: Consultation[];
}

export interface CreateConsultationPayload {
    patientId:	string;
    doctorId:	string;
    scheduledAt:	string;
    status: "confirmed" | "canceled";
}