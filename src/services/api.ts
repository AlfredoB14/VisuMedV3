import axios from 'axios';
import { Doctor } from '../redux/doctors/types/Doctors.interface';
import { Patient } from '../redux/patients/types/Patients.interface';
import { Study } from '../redux/studies/types/Studies.interface';

const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  'https://visumeddjango-production.up.railway.app/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const doctorLogin = async (email: string, password: string) => {
  const { data } = await apiClient.post('/doctors/login/', { email, password });
  return data as { message: string; doctor: Doctor };
};

export const createDoctor = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;   // raw password — backend will hash it
  role: string;
  phone?: string;
}) => {
  const { data } = await apiClient.post('/doctors/', payload);
  return data as Doctor;
};

// ─── Patients ─────────────────────────────────────────────────────────────────

export const getPatients = async (params?: {
  doctorId?: string;
  email?: string;
  phone?: string;
  search?: string;
}) => {
  const { data } = await apiClient.get('/patients/', { params });
  return data as Patient[];
};

export const createPatient = async (payload: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  postalCode?: string;
  state?: string;
  doctorId?: string;
}) => {
  const { data } = await apiClient.post('/patients/', payload);
  return data as Patient;
};

// ─── Studies ──────────────────────────────────────────────────────────────────

export const getStudies = async (params?: { patientId?: string }) => {
  const { data } = await apiClient.get('/studies-db/', { params });
  return data as Study[];
};

export const createStudy = async (payload: {
  orthancStudyId: string;
  patientId: string;
  referringDoctorId?: string;
  modality?: string;
  bodyPart?: string;
  studyDate?: string;
  status?: string;
}) => {
  const { data } = await apiClient.post('/studies-db/', payload);
  return data as Study;
};

export const updateStudy = async (id: string, payload: Partial<Study>) => {
  const { data } = await apiClient.put(`/studies-db/${id}/`, payload);
  return data as Study;
};

export interface OrthancStudy {
  orthancId: string;
  modality: string;
  description: string;
  date: string;
  patientName: string;
  seriesCount: number;
}

export const getOrthancStudies = async () => {
  const { data } = await apiClient.get('/orthanc-proxy/studies/');
  return data as OrthancStudy[];
};

// ─── Reports ──────────────────────────────────────────────────────────────────

export const getReports = async (params?: { studyId?: string }) => {
  const { data } = await apiClient.get('/reports/', { params });
  return data as Report[];
};

export const getReport = async (id: string) => {
  const { data } = await apiClient.get(`/reports/${id}/`);
  return data as Report;
};

export const createReport = async (payload: {
  studyId: string;
  doctorId?: string;
  studyName?: string;
  technique?: string;
  studyDate?: string;
  indication?: string;
  findings?: string;
  priorStudies?: string;
  conclusions?: string;
  suggestions?: string;
  status?: string;
}) => {
  const { data } = await apiClient.post('/reports/', payload);
  return data as Report;
};

export const updateReport = async (id: string, payload: Partial<Report>) => {
  const { data } = await apiClient.put(`/reports/${id}/`, payload);
  return data as Report;
};

export const getReportByToken = async (token: string) => {
  const { data } = await apiClient.get(`/reports/by-token/${token}/`);
  return data as Report;
};
