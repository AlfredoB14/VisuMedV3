import { api } from "./instance";
import { CreateReportPayload, Report } from "../redux/reports/types/Reports.interface";

const _reportsService = {
    getReports: async (params?: { studyId?: string }) => {
        const response = await api.get<Report[]>(`/reports/`, { params });
        return response.data;
    },
    getReport: async (id: string) => {
        const response = await api.get<Report>(`/reports/${id}/`);
        return response.data;
    },
    createReport: async (data: CreateReportPayload) => {
        const response = await api.post<Report>(`/reports/`, data);
        return response.data;
    },
    updateReport: async (id: string, data: Partial<Report>) => {
        const response = await api.put<Report>(`/reports/${id}/`, data);
        return response.data;
    },
    getReportByToken: async (token: string) => {
        const response = await api.get<Report>(`/reports/by-token/${token}/`);
        return response.data;
    },
};

export default _reportsService;
