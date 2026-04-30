export type MeasurementMode =
  | "longitudinal" | "bidirectional" | "annotation"
  | "ellipse" | "rectangle" | "circle" | "freehand";

export type ActiveTool = "pan" | "contrast" | null;
export type LayoutMode = 1 | 2 | 4;

export interface NormalizedPoint { x: number; y: number }

export interface MeasurementItem {
  id: string;
  mode: MeasurementMode;
  points: NormalizedPoint[];
  label: string;
  text?: string;
}

export interface StudyItem {
  id: string;
  orthancStudyId: string;
  modality: string;
  bodyPart: string;
  studyDate: string | null;
  status: string;
}

export interface TomographyProps {
  tomography: { title: string; date: string; description: string; orthancStudyId?: string };
  studies?: StudyItem[];
  onBack: () => void;
}

export interface PanelState {
    studyId: string | null;
    images: string[];
    instanceIds: string[];
    spacingByInstance: Record<string, { x: number; y: number }>;
    loading: boolean;
    loadingProgress: number;
    currentIndex: number;
    pixelSpacing: { x: number; y: number } | null;
    windowWidth: number | null;
    windowLevel: number | null;
    panOffset: { x: number; y: number };
    brightness: number;
    contrast: number;
    rotation: number;
    zoom: number;
    inverted: boolean;
    cineActive: boolean;
    cineFps: number;
  }

export const defaultPanel = (): PanelState => ({
    studyId: null, images: [], instanceIds: [], spacingByInstance: {},
    loading: false, loadingProgress: 0, currentIndex: 0,
    pixelSpacing: null, windowWidth: null, windowLevel: null,
    panOffset: { x: 0, y: 0 },
    brightness: 256, contrast: 256,
    rotation: 0, zoom: 1, inverted: false,
    cineActive: false, cineFps: 10,
  });

export interface SinglePanelProps {
    panel: PanelState;
    panelIndex: number;
    isActive: boolean;
    activeTool: ActiveTool;
    measurementMode: MeasurementMode | null;
    measurementsByImage: Record<string, MeasurementItem[]>;
    onActivate: () => void;
    onPanelUpdate: (fn: (p: PanelState) => PanelState) => void;
    onCommit: (idx: number, item: MeasurementItem) => void;
    onDelete: (idx: number, id: string) => void;
    onDrop: (idx: number, studyId: string) => void;
  }