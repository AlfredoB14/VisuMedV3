import {api} from "./instance";
import { CreatePatientPayload, Patient } from "../redux/patients/types/Patients.interface";

const _patientsService = {
  getPatients: async (doctorId: string) => {
    const response = await api.get<Patient[]>(`/doctors/${doctorId}/patients/`);
    return response.data;
  },
  createPatient: async (patient: CreatePatientPayload) => {
    const response = await api.post<Patient>(`/patients/`, patient);
    return response.data;
  },
};

export default _patientsService;
