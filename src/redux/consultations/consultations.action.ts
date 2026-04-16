import _doctorsService from "../../services/doctors";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateConsultationPayload } from "./types/Consultations.interface";
import _consultationsService from "../../services/consultations";

export const getConsultations = createAsyncThunk(
    "clients/getConsultations",
    async (params?: { patientId: string; doctorId: string; status: string }) => {
        const response = await _consultationsService.getConsultation(params)
        return response;
    }
)

export const createConsultation = createAsyncThunk(
  "clients/createDoctor",
  async (consultation: CreateConsultationPayload) => {
    const response = await _consultationsService.createConsultation(consultation);
    return response;
  },
);

