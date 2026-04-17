import { createSlice } from "@reduxjs/toolkit";
import { createReport, getReport, getReports, getReportByToken, updateReport } from "./reports.action";
import { IReportsUI, Report } from "./types/Reports.interface";

const initialState: IReportsUI = {
  ui: { loading: false, error: null },
};

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReports(state) {
      state.ui.reports = [];
    },
    clearSelectedReport(state) {
      state.ui.selectedReport = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReports.pending, (state) => {
        state.ui.loading = true;
        state.ui.error = null;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.ui.loading = false;
        state.ui.reports = action.payload as Report[];
      })
      .addCase(getReports.rejected, (state) => {
        state.ui.loading = false;
        state.ui.error = "No se pudieron cargar los reportes.";
      })

      .addCase(getReport.pending, (state) => {
        state.ui.loading = true;
        state.ui.error = null;
      })
      .addCase(getReport.fulfilled, (state, action) => {
        state.ui.loading = false;
        state.ui.selectedReport = action.payload as Report;
      })
      .addCase(getReport.rejected, (state) => {
        state.ui.loading = false;
        state.ui.error = "No se pudo cargar el reporte.";
      })

      .addCase(createReport.pending, (state) => {
        state.ui.loading = true;
        state.ui.error = null;
      })
      .addCase(createReport.fulfilled, (state) => {
        state.ui.loading = false;
      })
      .addCase(createReport.rejected, (state) => {
        state.ui.loading = false;
        state.ui.error = "No se pudo crear el reporte.";
      })

      .addCase(updateReport.pending, (state) => {
        state.ui.loading = true;
        state.ui.error = null;
      })
      .addCase(updateReport.fulfilled, (state) => {
        state.ui.loading = false;
      })
      .addCase(updateReport.rejected, (state) => {
        state.ui.loading = false;
        state.ui.error = "No se pudo actualizar el reporte.";
      })

      .addCase(getReportByToken.pending, (state) => {
        state.ui.loading = true;
        state.ui.error = null;
      })
      .addCase(getReportByToken.fulfilled, (state, action) => {
        state.ui.loading = false;
        state.ui.selectedReport = action.payload as Report;
      })
      .addCase(getReportByToken.rejected, (state) => {
        state.ui.loading = false;
        state.ui.error = "No se pudo cargar el reporte por token.";
      });
  },
});

export const { clearReports, clearSelectedReport } = reportsSlice.actions;
export default reportsSlice.reducer;
