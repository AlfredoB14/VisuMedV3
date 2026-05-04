export interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    passwordHash: string;
    createdAt: string;
}

export interface IDoctorsUI {
    ui: IDoctorsState;
  }

export interface IDoctorsState {
  loading: boolean;
  doctors?: Doctor[];
  agendaData?: AgendaData;
}

export interface CreateDoctorPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    passwordHash: string;
}

export interface AgendaData {
  doctorId: string;
  totalConsultationsToda: number,
  consultationsToday: number,
  nextConsultationTime: string,
  consultations: {
    scheduledAt: string,
    time: string,
    patientName: string,
  }[]
}