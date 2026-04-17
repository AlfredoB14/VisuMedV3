import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateReportPayload, Report } from "./types/Reports.interface";
import _reportsService from "../../services/reports";

export const getReports = createAsyncThunk(
    "reports/getReports",
    async (params?: { studyId?: string }) => {
        const response = await _reportsService.getReports(params);
        return response as Report[];
    }
);

export const getReport = createAsyncThunk(
    "reports/getReport",
    async (id: string) => {
        const response = await _reportsService.getReport(id);
        return response as Report;
    }
);

export const createReport = createAsyncThunk(
    "reports/createReport",
    async (data: CreateReportPayload) => {
        const response = await _reportsService.createReport(data);
        return response as Report;
    }
);

export const updateReport = createAsyncThunk(
    "reports/updateReport",
    async ({ id, data }: { id: string; data: Partial<Report> }) => {
        const response = await _reportsService.updateReport(id, data);
        return response as Report;
    }
);

export const getReportByToken = createAsyncThunk(
    "reports/getReportByToken",
    async (token: string) => {
        const response = await _reportsService.getReportByToken(token);
        return response as Report;
    }
);
