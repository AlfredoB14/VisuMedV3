import { createSlice } from "@reduxjs/toolkit";
import { Consultation, IConsultationUI } from "./types/Consultations.interface";
import { createConsultation, getConsultations, getPatientConsultation } from "./consultations.action";


const initialState: IConsultationUI = {
  ui: { loading: false, error: null },
};

export const consultationSlice = createSlice({
  name: "consultation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getConsultations.pending, (state) => {
            state.ui.loading = true;
        })
        .addCase(getConsultations.fulfilled, (state, action) => {
            state.ui.loading = false;
            state.ui.consultations = action.payload as Consultation[];
        })
        .addCase(getConsultations.rejected, (state) => {
            state.ui.loading = false;
            state.ui.error = "Error al obtener las consultas."
        })
        .addCase(createConsultation.pending, (state) => {
            state.ui.loading = true;
        })
        .addCase(createConsultation.fulfilled, (state) => {
            state.ui.loading = false;
        })
        .addCase(createConsultation.rejected, (state) => {
            state.ui.loading = false;
            state.ui.error = "Error al crear una consulta."
        })
        .addCase(getPatientConsultation.pending, (state) => {
            state.ui.loading = true;
        })
        .addCase(getPatientConsultation.fulfilled, (state, action) => {
            state.ui.loading = false;
            state.ui.patientConsultation = action.payload as Consultation[];
        })
        .addCase(getPatientConsultation.rejected, (state) => {
            state.ui.loading = false;
            state.ui.error = "Error al obtener las consultas del paciente."
        })
  },
});
