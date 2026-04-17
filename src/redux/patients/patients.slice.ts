import { createSlice } from "@reduxjs/toolkit";
import { IPatientsUI, Patient } from "./types/Patients.interface";
import { createPatient, getPatients } from "./patients.action";

const initialState: IPatientsUI = {
  ui: { loading: false, error: null },
};

export const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getPatients.pending, (state) => {
        state.ui.loading = true;
        state.ui.error = null;
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.ui.loading = false;
        state.ui.patients = action.payload as Patient[];
      })
      .addCase(getPatients.rejected, (state) => {
        state.ui.loading = false;
        state.ui.error = "No se pudieron cargar los pacientes.";
      })
      .addCase(createPatient.pending, (state) => {
        state.ui.loading = true;
        state.ui.error = null;
      })
      .addCase(createPatient.fulfilled, (state) => {
        state.ui.loading = false;
      })
      .addCase(createPatient.rejected, (state) => {
        state.ui.loading = false;
        state.ui.error = "No se pudo crear el paciente.";
      });
  },
});
