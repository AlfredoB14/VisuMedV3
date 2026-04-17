import axios from 'axios';
import { Doctor } from '../redux/doctors/types/Doctors.interface';

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



