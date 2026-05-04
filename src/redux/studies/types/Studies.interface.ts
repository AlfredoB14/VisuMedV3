export interface Study {
    id: string;
    orthancStudyId: string;
    patientId: string;
    referringDoctorId: string | null;
    interpretingDoctorId: string | null;
    modality: string;
    bodyPart: string;
    studyDate: string | null;
    status: string;
    createdAt: string;
  }


export interface CreateStudyPayload{
    orthancStudyId: string;
    patientId: string;
    referringDoctorId?: string;
    modality?: string;
    bodyPart?: string;
    studyDate?: string;
    status?: string;
}

export interface OrthancStudy {
    orthancId: string;
    modality: string;
    description: string;
    date: string;
    patientName: string;
    seriesCount: number;
}

export interface IStudiesUI {
    ui: IStudiesState;
}

export interface IStudiesState {
    loading: boolean;
    error: string | null;
    studies?: Study[];
    orthancStudies?: OrthancStudy[];
    visorStudy?: VisorStudy;
}

export interface VisorStudy {
    orthancStudyId: string;
    plane: string;
    total: number;
    pixelSpacing: [number, number];
    instances: VisorInstances[]
}

export interface VisorInstances {
    instanceId: string;
    seriesId: string;
    url: string;
    instanceNumber: number;
}