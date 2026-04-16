import { createSlice } from "@reduxjs/toolkit";
import { Consultation, IConsultationUI } from "./types/consultations.interface";
import { createConsultation, getConsultations } from "./consultations.action";


const initialState: IConsultationUI = {
  ui: { loading: false },
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
        })
        .addCase(createConsultation.pending, (state) => {
            state.ui.loading = true;
        })
        .addCase(createConsultation.fulfilled, (state) => {
            state.ui.loading = false;
        })
        .addCase(createConsultation.rejected, (state) => {
            state.ui.loading = false;
        })
  },
});
