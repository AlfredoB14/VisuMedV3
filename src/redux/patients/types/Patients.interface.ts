export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    address: string;
    postalCode: string;
    state: string;
    createdAt: string;
    lastAppointment: string;
}

export interface IPatientsUI {
    ui: IPatientsState;
  }

export interface IPatientsState {
  loading: boolean;
  patients?: Patient[];
}

export interface CreatePatientPayload extends Patient {
    doctorId: string;
}