export interface Patient {
  id: string;
  doctorId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string | null;
  gender: string;
  address: string;
  postalCode: string;
  state: string;
  lastConsultationAt: string | null;
  createdAt: string;
}

export interface IPatientsUI {
    ui: IPatientsState;
  }

export interface IPatientsState {
  loading: boolean;
  patients?: Patient[];
  error: string | null;
}

export interface CreatePatientPayload extends Patient {
    doctorId: string;
}