import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateStudyPayload, OrthancStudy, Study } from "./types/Studies.interface";
import _studiesService from "../../services/studies";

export const createStudy = createAsyncThunk(
    "studies/createStudy",
    async (data: CreateStudyPayload) => {
        const response = await _studiesService.createStudy(data);
        return response as Study;
    },
);

export const getStudies = createAsyncThunk(
    "studies/getStudies",
    async (patientId: string) => {
        const response = await _studiesService.getStudies({ patientId: patientId });
        return response as Study[];
    },
);

export const updateStudy = createAsyncThunk(
    "studies/updateStudy",
    async ({ id, data }: { id: string; data: Partial<Study> }) => {
        const response = await _studiesService.updateStudy(id, data);
        return response as Study;
    }
);

export const getOrthancStudies = createAsyncThunk(
    "studies/getOrthancStudies",
    async () => {
        const response = await _studiesService.getOrthancStudies();
        return response as OrthancStudy[];
    }
)