import { createSlice } from "@reduxjs/toolkit";
import { Doctor, IDoctorsUI } from "../doctors/types/Doctors.interface";
import {
    createDoctor,
  getDoctors,
} from "../doctors/doctors.action";

const initialState: IDoctorsUI = {
  ui: { loading: false },
};

export const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDoctors.pending, (state) => {
        state.ui.loading = true;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.ui.loading = false;
        state.ui.doctors = action.payload as Doctor[];
      })
      .addCase(getDoctors.rejected, (state) => {
        state.ui.loading = false;
      })
      .addCase(createDoctor.pending, (state) => {
        state.ui.loading = true;
      })
      .addCase(createDoctor.fulfilled, (state) => {
        state.ui.loading = false;
      })
      .addCase(createDoctor.rejected, (state) => {
        state.ui.loading = false;
      });
  },
});
