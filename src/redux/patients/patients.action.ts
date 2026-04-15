import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreatePatientPayload, Patient } from "./types/Patients.interface";
import _patientsService from "../../services/patients";

export const createPatient = createAsyncThunk(
    "patients/createPatient",
    async (patient: CreatePatientPayload) => {
        const response = await _patientsService.createPatient(patient);
        return response as Patient;
    },
    );

export const getPatients = createAsyncThunk(
    "patients/getPatients",
    async (doctorId: string) => {
        const response = await _patientsService.getPatients(doctorId);
        return response as Patient[];
    },
);