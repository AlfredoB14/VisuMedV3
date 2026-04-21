import {api} from "./instance";
import {
  CreateDoctorPayload,
  Doctor,
} from "../redux/doctors/types/Doctors.interface";

const _doctorsService = {
  getDoctors: async () => {
    const response = await api.get<Doctor[]>(`/doctor`);
    return response.data;
  },
  createDoctor: async (doctor: CreateDoctorPayload) => {
    const response = await api.post<Doctor>(`/doctor`, doctor);
    return response.data;
  },
};

export default _doctorsService;
