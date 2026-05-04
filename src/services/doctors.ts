import {api} from "./instance";
import {
  AgendaData,
  CreateDoctorPayload,
  Doctor,
} from "../redux/doctors/types/Doctors.interface";

const _doctorsService = {
  getDoctors: async () => {
    const response = await api.get<Doctor[]>(`/doctors`);
    return response.data;
  },
  createDoctor: async (doctor: CreateDoctorPayload) => {
    const response = await api.post<Doctor>(`/doctors`, doctor);
    return response.data;
  },
  getDayConsultations: async (doctorId: string) => {
    const response = await api.get<AgendaData>(`/doctors/${doctorId}/agenda/`);
    return response.data;
  },
};

export default _doctorsService;
