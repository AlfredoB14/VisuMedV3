export interface Report {
    id: string;
    studyId: string;
    doctorId: string | null;
    studyName: string;
    technique: string;
    studyDate: string | null;
    indication: string;
    findings: string;
    priorStudies: string;
    conclusions: string;
    suggestions: string;
    status: string;
    shareToken: string | null;
    createdAt: string;
    // enriched fields (from by-token endpoint)
    doctorName?: string | null;
    doctorRole?: string | null;
    orthancStudyId?: string | null;
    studyModality?: string | null;
    studyBodyPart?: string | null;
}

export interface CreateReportPayload {
    studyId: string;
    doctorId?: string;
    studyName?: string;
    technique?: string;
    studyDate?: string;
    indication?: string;
    findings?: string;
    priorStudies?: string;
    conclusions?: string;
    suggestions?: string;
    status?: string;
}

export interface IReportsUI {
    ui: IReportsState;
}

export interface IReportsState {
    loading: boolean;
    reports?: Report[];
    selectedReport?: Report;
    error: string | null;
}
