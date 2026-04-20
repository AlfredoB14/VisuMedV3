import { createSlice } from "@reduxjs/toolkit";
import { createStudy, getOrthancStudies, getStudies, updateStudy } from "./studies.action";
import { IStudiesUI, OrthancStudy, Study } from "./types/Studies.interface";

const initialState: IStudiesUI = {
  ui: { loading: false, error: null },
};

export const studiesSlice = createSlice({
  name: "studies",
  initialState,
  reducers: {
    clearStudies(state) {
      state.ui.studies = [];
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getStudies.pending, (state) => {
        state.ui.loading = true;
        state.ui.error = null;
      })
      .addCase(getStudies.fulfilled, (state, action) => {
        state.ui.loading = false;
        state.ui.studies = action.payload as Study[];
      })
      .addCase(getStudies.rejected, (state) => {
        state.ui.loading = false;
        state.ui.error = "No se pudieron cargar los estudios del paciente.";
      })
      .addCase(createStudy.pending, (state) => {
        state.ui.loading = true;
        state.ui.error = null;
      })
      .addCase(createStudy.fulfilled, (state) => {
        state.ui.loading = false;
      })
      .addCase(createStudy.rejected, (state) => {
        state.ui.loading = false;
        state.ui.error = "No se pudo crear el estudio.";
      })
      .addCase(updateStudy.pending, (state) => {
        state.ui.loading = true;
        state.ui.error = null;
      })
      .addCase(updateStudy.fulfilled , (state) => {
        state.ui.loading = false;
      })
      .addCase(updateStudy.rejected, (state) => {
        state.ui.loading = false;
        state.ui.error = "No se pudo actualizar el estudio.";
      })
      .addCase(getOrthancStudies.pending, (state) => {
        state.ui.loading = true;
        state.ui.error = null;
      })
      .addCase(getOrthancStudies.fulfilled, (state, action) => {
        state.ui.loading = false;
        state.ui.orthancStudies = action.payload as OrthancStudy[];
      })
      .addCase(getOrthancStudies.rejected, (state) => {
        state.ui.loading = false;
        state.ui.error = "No se pudieron cargar los estudios de Orthanc.";
      })
  },
});

export const { clearStudies } = studiesSlice.actions;
export default studiesSlice.reducer;
