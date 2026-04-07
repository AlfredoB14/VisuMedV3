import _doctorsService from "../../services/doctors";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateDoctorPayload } from "./types/Doctors.interface";

export const getDoctors = createAsyncThunk(
  "clients/getDoctors",
  async () => {
    const doctors = await _doctorsService.getDoctors();
    return doctors;
  },
);

export const createDoctor = createAsyncThunk(
  "clients/createDoctor",
  async (doctor: CreateDoctorPayload) => {
    const response = await _doctorsService.createDoctor(doctor);
    return response;
  },
);

