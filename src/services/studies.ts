import { api } from "./instance";
import { CreateStudyPayload, Study, OrthancStudy } from "../redux/studies/types/Studies.interface";

const _studiesService = {
  getStudies: async (params?: {patientId?: string}) => {
    const response = await api.get<Study[]>(`/studies-db`, { params });
    return response.data;
  },
  createStudy: async (data: CreateStudyPayload) => {
    const response = await api.post<Study>(`/doctor`, data);
    return response.data;
  },
  updateStudy: async (id: string, data: Partial<Study>) => {
    const response = await api.put<Study>(`/studies-db/${id}`, data);
    return response.data;
  },
  getOrthancStudies: async () => {
    const response = await api.get<OrthancStudy[]>('/orthanc-proxy/studies/');
    return response.data;
  }
};

export default _studiesService;
