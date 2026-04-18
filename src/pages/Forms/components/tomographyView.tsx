import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  ArrowLeftRight, Camera, Circle, ChevronDown, Contrast,
  LayoutGrid, Move, PenTool, Pencil, RotateCw, RotateCcw,
  Ruler, Square, ZoomIn, ZoomOut,
} from "lucide-react";
import { studiesSelector } from "../../../redux/studies/studies.selector";
import { RootState } from "../../../redux/store";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface ImageData {
  instanceId?: string;
  imageUrl: string;
  pixelSpacing?: unknown;
  imagerPixelSpacing?: unknown;
}

type MeasurementMode =
  | "longitudinal" | "bidirectional" | "annotation"
  | "ellipse" | "rectangle" | "circle" | "freehand";

type ActiveTool = "pan" | "contrast" | null;
type LayoutMode = 1 | 2 | 4;

interface NormalizedPoint { x: number; y: number }

interface MeasurementItem {
  id: string;
  mode: MeasurementMode;
  points: NormalizedPoint[];
  label: string;
  text?: string;
}

interface StudyItem {
  id: string;
  orthancStudyId: string;
  modality: string;
  bodyPart: string;
  studyDate: string | null;
  status: string;
}

interface TomographyProps {
  tomography: { title: string; date: string; description: string; orthancStudyId?: string };
  studies?: StudyItem[];
  onBack: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel state
// ─────────────────────────────────────────────────────────────────────────────
interface PanelState {
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

const defaultPanel = (): PanelState => ({
  studyId: null, images: [], instanceIds: [], spacingByInstance: {},
  loading: false, loadingProgress: 0, currentIndex: 0,
  pixelSpacing: null, windowWidth: null, windowLevel: null,
  panOffset: { x: 0, y: 0 },
  brightness: 256, contrast: 256,
  rotation: 0, zoom: 1, inverted: false,
  cineActive: false, cineFps: 10,
});

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "https://visumeddjango-production.up.railway.app/api";
const DEMO_STUDY_ID = "ee44d1f7-6fd75bcb-ae051007-677351ca-759382ea";

const MEASURE_COLOR = "#FFD600";
const MEASURE_FILL  = "rgba(255,214,0,0.08)";
const DRAFT_COLOR   = "#40C4FF";
const DRAFT_FILL    = "rgba(64,196,255,0.08)";
const HANDLE_R      = 5;

/** Full CSS filter string for a panel */
const toFilter = (b: number, c: number, inv: boolean) =>
  `brightness(${((b / 256) * 100).toFixed(1)}%) contrast(${((c / 256) * 100).toFixed(1)}%)${inv ? " invert(1)" : ""}`;

// ─────────────────────────────────────────────────────────────────────────────
// SinglePanel
// ─────────────────────────────────────────────────────────────────────────────
interface SinglePanelProps {
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

function SinglePanel({
  panel, panelIndex, isActive, activeTool, measurementMode,
  measurementsByImage, onActivate, onPanelUpdate, onCommit, onDelete, onDrop,
}: SinglePanelProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLImageElement>(null);
  const scrollTm = useRef<number | null>(null);

  const [dr,       setDr]       = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [lv,       setLv]       = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [isDrawing,  setIsDrawing]  = useState(false);
  const [draft,      setDraft]      = useState<NormalizedPoint[]>([]);
  const [cursor,     setCursor]     = useState<NormalizedPoint | null>(null);

  const isPanRef     = useRef(false);
  const panStart     = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const isCtrRef     = useRef(false);
  const ctrStart     = useRef({ x: 0, y: 0, b: 256, c: 256 });
  const cineRef      = useRef<number | null>(null);

  // Cine playback
  useEffect(() => {
    if (panel.cineActive && panel.images.length > 1) {
      const interval = 1000 / Math.max(1, panel.cineFps);
      cineRef.current = window.setInterval(() => {
        onPanelUpdate(p => ({
          ...p,
          currentIndex: (p.currentIndex + 1) % p.images.length,
        }));
      }, interval);
    } else {
      if (cineRef.current !== null) {
        window.clearInterval(cineRef.current);
        cineRef.current = null;
      }
    }
    return () => {
      if (cineRef.current !== null) {
        window.clearInterval(cineRef.current);
        cineRef.current = null;
      }
    };
  }, [panel.cineActive, panel.cineFps, panel.images.length]);

  const key          = `${panel.studyId}:${panel.currentIndex}`;
  const measurements = measurementsByImage[key] ?? [];
  const sp           = panel.pixelSpacing;
  const unit         = sp ? "mm" : "px";
  const unitA        = sp ? "mm²" : "px²";

  // displayRect
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const upd = () => {
      const img = imgRef.current;
      if (!img) { setDr({ x:0,y:0,width:0,height:0 }); return; }
      const sw = stage.clientWidth, sh = stage.clientHeight;
      const nw = img.naturalWidth||0, nh = img.naturalHeight||0;
      if (!sw||!sh||!nw||!nh) { setDr({ x:0,y:0,width:0,height:0 }); return; }
      const sc = Math.min(sw/nw, sh/nh);
      setDr({ x:(sw-nw*sc)/2, y:(sh-nh*sc)/2, width:nw*sc, height:nh*sc });
    };
    const ro = new ResizeObserver(() => { upd(); setLv(v=>v+1); });
    ro.observe(stage);
    upd();
    window.addEventListener("resize", upd);
    return () => { ro.disconnect(); window.removeEventListener("resize", upd); };
  }, [panel.currentIndex, panel.studyId, panel.loading, panel.images.length, lv]);

  // helpers
  const getPoint = (cx: number, cy: number): NormalizedPoint | null => {
    const s = stageRef.current; if (!s||!dr.width||!dr.height) return null;
    const b = s.getBoundingClientRect();
    const lx = Math.max(dr.x, Math.min(dr.x+dr.width,  cx-b.left));
    const ly = Math.max(dr.y, Math.min(dr.y+dr.height, cy-b.top));
    return { x:(lx-dr.x)/dr.width, y:(ly-dr.y)/dr.height };
  };

  const toStage = (p: NormalizedPoint) => ({ x: dr.x+p.x*dr.width, y: dr.y+p.y*dr.height });

  const hasDrag = (a: NormalizedPoint, b: NormalizedPoint) =>
    Math.hypot((b.x-a.x)*dr.width,(b.y-a.y)*dr.height) >= 4;

  // metrics
  const getMet = () => {
    const img = imgRef.current;
    const spacing = sp ?? { x:1, y:1 };
    if (!img) return { spacing, w:0, h:0 };
    return { spacing, w:img.naturalWidth||img.getBoundingClientRect().width, h:img.naturalHeight||img.getBoundingClientRect().height };
  };

  const distMm = (a: NormalizedPoint, b: NormalizedPoint) => {
    const { spacing, w, h } = getMet();
    return Math.hypot((b.x-a.x)*w*spacing.x, (b.y-a.y)*h*spacing.y);
  };

  const rectMet = (a: NormalizedPoint, b: NormalizedPoint) => {
    const { spacing, w, h } = getMet();
    const rw = Math.abs(b.x-a.x)*w*spacing.x, rh = Math.abs(b.y-a.y)*h*spacing.y;
    return { rw, rh, area: rw*rh };
  };

  const freeA = (pts: NormalizedPoint[]) => {
    if (pts.length<3) return 0;
    const { spacing, w, h } = getMet();
    const sc = pts.map(p=>({x:p.x*w*spacing.x,y:p.y*h*spacing.y}));
    let a=0; for(let i=0;i<sc.length;i++){const n=sc[(i+1)%sc.length];a+=sc[i].x*n.y-n.x*sc[i].y;}
    return Math.abs(a/2);
  };

  const buildLabel = (mode: MeasurementMode, pts: NormalizedPoint[]): string => {
    if (mode==="annotation") return "Anotación";
    const [s,e]=pts; if(!s||!e) return "";
    if (mode==="longitudinal") return `${distMm(s,e).toFixed(1)} ${unit}`;
    if (mode==="bidirectional") {
      const W=distMm(s,e).toFixed(1);
      const cx=(s.x+e.x)/2,cy=(s.y+e.y)/2,dx=e.x-s.x,dy=e.y-s.y;
      const len=Math.hypot(dx,dy)/2,nx=-dy,ny=dx,norm=Math.hypot(nx,ny)||1;
      const p1={x:cx-(nx/norm)*len,y:cy-(ny/norm)*len},p2={x:cx+(nx/norm)*len,y:cy+(ny/norm)*len};
      return `W: ${W} ${unit}\nL: ${distMm(p1,p2).toFixed(1)} ${unit}`;
    }
    if (mode==="rectangle"){const {rw,rh,area}=rectMet(s,e);return `${rw.toFixed(1)} × ${rh.toFixed(1)} ${unit}\nÁrea: ${area.toFixed(2)} ${unitA}`;}
    if (mode==="ellipse"){const {rw,rh}=rectMet(s,e);return `${rw.toFixed(1)} × ${rh.toFixed(1)} ${unit}\nÁrea: ${(Math.PI*(rw/2)*(rh/2)).toFixed(2)} ${unitA}`;}
    if (mode==="circle"){const {rw,rh}=rectMet(s,e);const d=Math.min(rw,rh),r=d/2;return `Ø ${d.toFixed(1)} ${unit}\nÁrea: ${(Math.PI*r*r).toFixed(2)} ${unitA}`;}
    if (mode==="freehand") return `Área: ${freeA(pts).toFixed(2)} ${unitA}`;
    return "";
  };

  // pointer
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    onActivate();
    if (activeTool==="pan") {
      e.currentTarget.setPointerCapture(e.pointerId);
      isPanRef.current=true;
      panStart.current={x:e.clientX,y:e.clientY,ox:panel.panOffset.x,oy:panel.panOffset.y};
      return;
    }
    if (activeTool==="contrast") {
      e.currentTarget.setPointerCapture(e.pointerId);
      isCtrRef.current=true;
      ctrStart.current={x:e.clientX,y:e.clientY,b:panel.brightness,c:panel.contrast};
      return;
    }
    if (!measurementMode) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt=getPoint(e.clientX,e.clientY); if(!pt) return;
    if (measurementMode==="annotation") {
      const text=window.prompt("Texto de anotación");
      if(!text?.trim()) return;
      onCommit(panelIndex,{id:crypto.randomUUID(),mode:"annotation",points:[pt],text:text.trim(),label:text.trim()});
      return;
    }
    setDraft([pt]); setIsDrawing(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeTool==="pan" && isPanRef.current) {
      const dx=e.clientX-panStart.current.x, dy=e.clientY-panStart.current.y;
      onPanelUpdate(p=>({...p,panOffset:{x:panStart.current.ox+dx,y:panStart.current.oy+dy}}));
      return;
    }
    // OHIF-style: horizontal → contrast (window width), vertical → brightness (window level)
    if (activeTool==="contrast" && isCtrRef.current) {
      const dx=e.clientX-ctrStart.current.x;   // right = more contrast
      const dy=e.clientY-ctrStart.current.y;   // down  = less bright
      onPanelUpdate(p=>({
        ...p,
        contrast:  Math.max(0, Math.min(512, ctrStart.current.c + dx)),
        brightness:Math.max(0, Math.min(512, ctrStart.current.b - dy)),
      }));
      return;
    }
    const pt=getPoint(e.clientX,e.clientY); setCursor(pt);
    if(!isDrawing||!measurementMode) return;
    e.preventDefault(); if(!pt) return;
    if(measurementMode==="freehand"){setDraft(prev=>[...prev,pt]);return;}
    setDraft(prev=>prev.length>0?[prev[0],pt]:[pt]);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if(e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if(activeTool==="pan"){isPanRef.current=false;return;}
    if(activeTool==="contrast"){isCtrRef.current=false;return;}
    if(!measurementMode||!isDrawing) return;
    e.preventDefault();
    const pt=getPoint(e.clientX,e.clientY)??draft[draft.length-1];
    if(!pt){setIsDrawing(false);setDraft([]);return;}
    if(measurementMode==="freehand"){
      const fps=[...draft,pt];
      if(fps.length>=3) onCommit(panelIndex,{id:crypto.randomUUID(),mode:measurementMode,points:fps,label:buildLabel(measurementMode,fps)});
    } else {
      const start=draft[0];
      if(start&&hasDrag(start,pt)){
        const fps=[start,pt];
        onCommit(panelIndex,{id:crypto.randomUUID(),mode:measurementMode,points:fps,label:buildLabel(measurementMode,fps)});
      }
    }
    setIsDrawing(false); setDraft([]);
  };

  const onPointerLeave = () => {
    setCursor(null); isPanRef.current=false; isCtrRef.current=false;
    if(isDrawing){setIsDrawing(false);setDraft([]);}
  };

  const onWheel = (e: React.WheelEvent) => {
    if(scrollTm.current) window.clearTimeout(scrollTm.current);
    scrollTm.current=window.setTimeout(()=>{
      if(e.deltaY>0&&panel.currentIndex<panel.images.length-1)
        onPanelUpdate(p=>({...p,currentIndex:p.currentIndex+1}));
      else if(e.deltaY<0&&panel.currentIndex>0)
        onPanelUpdate(p=>({...p,currentIndex:p.currentIndex-1}));
    },10);
  };

  // drag & drop
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);
  const onDropEvt   = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const id=e.dataTransfer.getData("studyId"); if(id) onDrop(panelIndex,id);
  };

  // ── SVG helpers ────────────────────────────────────────────────────────────
  const lbl = (x: number, y: number, text: string, color: string, k: string) => {
    const lines=text.split("\n"), lh=14, ml=Math.max(...lines.map(l=>l.length));
    return (
      <g key={`l-${k}`}>
        <rect x={x-2} y={y-lh+2} width={ml*7+10} height={lines.length*lh+6} fill="rgba(0,0,0,0.55)" rx={3}/>
        {lines.map((ln,i)=>(
          <text key={i} x={x+3} y={y+i*lh} fill={color} fontSize={11.5}
            fontFamily="'Roboto Mono','Courier New',monospace" fontWeight={600}>{ln}</text>
        ))}
      </g>
    );
  };

  const tick = (ax:number,ay:number,bx:number,by:number,color:string) => {
    const dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,T=5;
    return <line x1={ax+nx*T} y1={ay+ny*T} x2={ax-nx*T} y2={ay-ny*T} stroke={color} strokeWidth={1.5}/>;
  };

  const renderLine = (
    id:string,x1:number,y1:number,x2:number,y2:number,
    label:string,color:string,isDraft=false,
    ext?:{x1:number;y1:number;x2:number;y2:number},
  ) => {
    const mx=(x1+x2)/2,my=(y1+y2)/2;
    return (
      <g key={id}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5}/>
        {tick(x1,y1,x2,y2,color)}{tick(x2,y2,x1,y1,color)}
        {ext&&<><line x1={ext.x1} y1={ext.y1} x2={ext.x2} y2={ext.y2} stroke={color} strokeWidth={1.5}/>
          {tick(ext.x1,ext.y1,ext.x2,ext.y2,color)}{tick(ext.x2,ext.y2,ext.x1,ext.y1,color)}</>}
        {!isDraft&&<>
          <circle cx={x1} cy={y1} r={HANDLE_R} fill="transparent" stroke={color} strokeWidth={1.5}/>
          <circle cx={x2} cy={y2} r={HANDLE_R} fill="transparent" stroke={color} strokeWidth={1.5}/>
        </>}
        {label&&lbl(mx+8,my-8,label,color,id)}
        {!isDraft&&<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={12} style={{cursor:"pointer"}} onClick={()=>onDelete(panelIndex,id)}/>}
      </g>
    );
  };

  const renderM = (m: MeasurementItem) => {
    const s=toStage(m.points[0]); if(!s) return null;
    if(m.mode==="annotation") return (
      <g key={m.id}>
        <circle cx={s.x} cy={s.y} r={4} fill={MEASURE_COLOR}/>
        <line x1={s.x} y1={s.y} x2={s.x+18} y2={s.y-14} stroke={MEASURE_COLOR} strokeWidth={1}/>
        {lbl(s.x+20,s.y-14,m.text||m.label,MEASURE_COLOR,m.id)}
        <circle cx={s.x} cy={s.y} r={10} fill="transparent" style={{cursor:"pointer"}} onClick={()=>onDelete(panelIndex,m.id)}/>
      </g>
    );
    const e=m.points[1]?toStage(m.points[1]):null;
    if(m.mode==="longitudinal"&&e) return renderLine(m.id,s.x,s.y,e.x,e.y,m.label,MEASURE_COLOR);
    if(m.mode==="bidirectional"&&e){
      const cx=(s.x+e.x)/2,cy=(s.y+e.y)/2,dx=e.x-s.x,dy=e.y-s.y,len=Math.hypot(dx,dy)/2;
      const nx=-dy,ny=dx,norm=Math.hypot(nx,ny)||1;
      const p1={x:cx-(nx/norm)*len,y:cy-(ny/norm)*len},p2={x:cx+(nx/norm)*len,y:cy+(ny/norm)*len};
      return renderLine(m.id,s.x,s.y,e.x,e.y,m.label,MEASURE_COLOR,false,{x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y});
    }
    if(!e) return null;
    const x=Math.min(s.x,e.x),y=Math.min(s.y,e.y),w=Math.abs(e.x-s.x),h=Math.abs(e.y-s.y);
    if(m.mode==="rectangle") return (
      <g key={m.id}>
        <rect x={x} y={y} width={w} height={h} fill={MEASURE_FILL} stroke={MEASURE_COLOR} strokeWidth={1.5}/>
        {[{cx:x,cy:y},{cx:x+w,cy:y},{cx:x,cy:y+h},{cx:x+w,cy:y+h}].map((p,i)=><circle key={i} cx={p.cx} cy={p.cy} r={HANDLE_R} fill="transparent" stroke={MEASURE_COLOR} strokeWidth={1.5}/>)}
        {lbl(x+w/2,y-8,m.label,MEASURE_COLOR,m.id)}
        <rect x={x} y={y} width={w} height={h} fill="transparent" style={{cursor:"pointer"}} onClick={()=>onDelete(panelIndex,m.id)}/>
      </g>
    );
    if(m.mode==="ellipse") return (
      <g key={m.id}>
        <ellipse cx={x+w/2} cy={y+h/2} rx={w/2} ry={h/2} fill={MEASURE_FILL} stroke={MEASURE_COLOR} strokeWidth={1.5}/>
        {[{cx:x+w/2,cy:y},{cx:x+w/2,cy:y+h},{cx:x,cy:y+h/2},{cx:x+w,cy:y+h/2}].map((p,i)=><circle key={i} cx={p.cx} cy={p.cy} r={HANDLE_R} fill="transparent" stroke={MEASURE_COLOR} strokeWidth={1.5}/>)}
        {lbl(x+w/2,y-8,m.label,MEASURE_COLOR,m.id)}
        <ellipse cx={x+w/2} cy={y+h/2} rx={w/2} ry={h/2} fill="transparent" style={{cursor:"pointer"}} onClick={()=>onDelete(panelIndex,m.id)}/>
      </g>
    );
    if(m.mode==="circle"){
      const r=Math.min(w,h)/2,cx=x+w/2,cy=y+h/2;
      return (
        <g key={m.id}>
          <circle cx={cx} cy={cy} r={r} fill={MEASURE_FILL} stroke={MEASURE_COLOR} strokeWidth={1.5}/>
          {[{cx,cy:cy-r},{cx,cy:cy+r},{cx:cx-r,cy},{cx:cx+r,cy}].map((p,i)=><circle key={i} cx={p.cx} cy={p.cy} r={HANDLE_R} fill="transparent" stroke={MEASURE_COLOR} strokeWidth={1.5}/>)}
          {lbl(x+w/2,y-8,m.label,MEASURE_COLOR,m.id)}
          <circle cx={cx} cy={cy} r={r} fill="transparent" style={{cursor:"pointer"}} onClick={()=>onDelete(panelIndex,m.id)}/>
        </g>
      );
    }
    if(m.mode==="freehand"){
      const spts=m.points.map(p=>toStage(p)).filter((p):p is{x:number;y:number}=>Boolean(p));
      if(!spts.length) return null;
      const pathD=spts.map((p,i)=>`${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
      const c=spts.reduce((a,p)=>({x:a.x+p.x,y:a.y+p.y}),{x:0,y:0});
      return (
        <g key={m.id}>
          <path d={`${pathD} Z`} fill={MEASURE_FILL} stroke={MEASURE_COLOR} strokeWidth={1.5}/>
          {lbl(c.x/spts.length+6,c.y/spts.length-6,m.label,MEASURE_COLOR,m.id)}
          <path d={`${pathD} Z`} fill="transparent" style={{cursor:"pointer"}} onClick={()=>onDelete(panelIndex,m.id)}/>
        </g>
      );
    }
    return null;
  };

  const renderDraft = () => {
    if(!isDrawing||!draft.length||measurementMode==="annotation") return null;
    if(measurementMode==="freehand"){
      const pathD=draft.map((p,i)=>{const s=toStage(p);return s?`${i===0?"M":"L"} ${s.x} ${s.y}`:""}).join(" ");
      return <path d={pathD} fill="none" stroke={DRAFT_COLOR} strokeWidth={1.5} strokeDasharray="4 3"/>;
    }
    const sn=draft[0],en=cursor??draft[draft.length-1];
    const s=toStage(sn),e=en?toStage(en):null;
    if(!s||!e) return null;
    const dl=buildLabel(measurementMode!,[sn,en!]);
    if(measurementMode==="longitudinal") return renderLine("draft",s.x,s.y,e.x,e.y,dl,DRAFT_COLOR,true);
    if(measurementMode==="bidirectional"){
      const cx=(s.x+e.x)/2,cy=(s.y+e.y)/2,dx=e.x-s.x,dy=e.y-s.y,len=Math.hypot(dx,dy)/2;
      const nx=-dy,ny=dx,norm=Math.hypot(nx,ny)||1;
      const p1={x:cx-(nx/norm)*len,y:cy-(ny/norm)*len},p2={x:cx+(nx/norm)*len,y:cy+(ny/norm)*len};
      return renderLine("draft",s.x,s.y,e.x,e.y,dl,DRAFT_COLOR,true,{x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y});
    }
    const x=Math.min(s.x,e.x),y=Math.min(s.y,e.y),w=Math.abs(e.x-s.x),h=Math.abs(e.y-s.y);
    if(measurementMode==="rectangle") return <g><rect x={x} y={y} width={w} height={h} fill={DRAFT_FILL} stroke={DRAFT_COLOR} strokeWidth={1.5} strokeDasharray="4 3"/>{lbl(x+w/2,y-8,dl,DRAFT_COLOR,"draft")}</g>;
    if(measurementMode==="ellipse")   return <g><ellipse cx={x+w/2} cy={y+h/2} rx={w/2} ry={h/2} fill={DRAFT_FILL} stroke={DRAFT_COLOR} strokeWidth={1.5} strokeDasharray="4 3"/>{lbl(x+w/2,y-8,dl,DRAFT_COLOR,"draft")}</g>;
    if(measurementMode==="circle"){const r=Math.min(w,h)/2;return <g><circle cx={x+w/2} cy={y+h/2} r={r} fill={DRAFT_FILL} stroke={DRAFT_COLOR} strokeWidth={1.5} strokeDasharray="4 3"/>{lbl(x+w/2,y-8,dl,DRAFT_COLOR,"draft")}</g>;}
    return null;
  };

  const renderCrosshair = () => {
    if(!measurementMode||!cursor||measurementMode==="freehand") return null;
    const s=toStage(cursor); if(!s) return null;
    return (
      <g style={{pointerEvents:"none"}}>
        <line x1={dr.x} y1={s.y} x2={dr.x+dr.width} y2={s.y} stroke={DRAFT_COLOR} strokeWidth={0.6} strokeDasharray="3 3" opacity={0.6}/>
        <line x1={s.x} y1={dr.y} x2={s.x} y2={dr.y+dr.height} stroke={DRAFT_COLOR} strokeWidth={0.6} strokeDasharray="3 3" opacity={0.6}/>
        <circle cx={s.x} cy={s.y} r={2.5} fill={DRAFT_COLOR} opacity={0.9}/>
      </g>
    );
  };

  const cur = measurementMode?"crosshair":activeTool==="pan"?"grab":activeTool==="contrast"?"ew-resize":"default";

  return (
    <div
      ref={stageRef}
      data-panel={panelIndex}
      className={`relative flex-1 bg-black overflow-hidden border-2 transition-colors ${isActive?"border-blue-500/60":"border-transparent"} ${dragOver?"!border-emerald-400/80":""}`}
      style={{cursor:cur,minWidth:0,minHeight:0,touchAction:"none"}}
      onClick={onActivate}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDropEvt}
    >
      {panel.loading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"/>
          <div className="w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{width:`${panel.loadingProgress}%`}}/>
          </div>
          <p className="mt-2 text-xs text-gray-400">{panel.loadingProgress}%</p>
        </div>
      ) : !panel.studyId||!panel.images.length ? (
        <div className="flex flex-col items-center justify-center h-full gap-3 select-none">
          <div className={`w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center transition-colors ${dragOver?"border-emerald-400 bg-emerald-900/20":"border-slate-600"}`}>
            <LayoutGrid className={`h-6 w-6 transition-colors ${dragOver?"text-emerald-400":"text-slate-500"}`}/>
          </div>
          <p className={`text-xs font-medium transition-colors ${dragOver?"text-emerald-400":"text-slate-500"}`}>
            {dragOver?"Soltar estudio aquí":"Arrastra un estudio aquí"}
          </p>
        </div>
      ) : (
        <div className="relative h-full w-full">
          <img
            ref={imgRef}
            src={panel.images[panel.currentIndex]}
            alt={`Panel ${panelIndex+1}`}
            className="absolute object-contain select-none pointer-events-none"
            style={{
              left:`${dr.x+panel.panOffset.x}px`, top:`${dr.y+panel.panOffset.y}px`,
              width:`${dr.width}px`, height:`${dr.height}px`,
              filter:toFilter(panel.brightness, panel.contrast, panel.inverted),
              transform:`rotate(${panel.rotation}deg) scale(${panel.zoom})`,
              transformOrigin:'center center',
            }}
            draggable={false}
            onLoad={()=>setLv(v=>v+1)}
          />

          {dr.width>0&&(
            <svg className="absolute inset-0 h-full w-full overflow-visible" style={{pointerEvents:"none"}}>
              <g style={{pointerEvents:"all"}}>{measurements.map(m=>renderM(m))}</g>
              <g style={{pointerEvents:"none"}}>{renderDraft()}</g>
              {renderCrosshair()}
            </svg>
          )}

          {/* Info overlay */}
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none flex flex-col gap-0.5">
            <span className="text-[10px] font-mono text-slate-300">
              W:{panel.windowWidth??"—"} · L:{panel.windowLevel??"—"}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {sp?`${sp.x.toFixed(3)}×${sp.y.toFixed(3)} mm/px`:"sin calibración"}
            </span>
            <span className="text-[11px] font-mono font-semibold text-slate-100">
              {panel.currentIndex+1}/{panel.images.length}
            </span>
          </div>

          {/* Contrast hint */}
          {activeTool==="contrast"&&isActive&&(
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 rounded-full bg-purple-900/60 border border-purple-500/50 px-3 py-1">
              <span className="text-[10px] font-semibold text-purple-300">← → contraste · ↕ brillo</span>
            </div>
          )}

          {dragOver&&(
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/20 border-2 border-emerald-400/80 z-20 rounded">
              <p className="text-emerald-400 text-sm font-semibold">Soltar estudio aquí</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main TomographyView
// ─────────────────────────────────────────────────────────────────────────────
export default function TomographyView({ tomography, studies, onBack }: TomographyProps) {
  const reduxStudies = useSelector((state: RootState) => studiesSelector(state).ui.studies) ?? [];
  const patientStudies: StudyItem[] = (studies && studies.length > 0 ? studies : reduxStudies) ?? [];
  const cleanedTitle = tomography.title.replace(/\bpending\b/gi,"").trim();

  const [layoutMode,       setLayoutMode]       = useState<LayoutMode>(1);
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const [activePanel,      setActivePanel]      = useState(0);
  const layoutMenuRef = useRef<HTMLDivElement>(null);

  const [panels, setPanels] = useState<PanelState[]>([
    { ...defaultPanel(), studyId: tomography.orthancStudyId || DEMO_STUDY_ID },
    defaultPanel(), defaultPanel(), defaultPanel(),
  ]);

  const [activeTool,           setActiveTool]           = useState<ActiveTool>(null);
  const [measurementMode,      setMeasurementMode]      = useState<MeasurementMode | null>(null);
  const [measurementsByImage,  setMeasurementsByImage]  = useState<Record<string,MeasurementItem[]>>({});
  const [isMeasureMenuOpen,    setIsMeasureMenuOpen]    = useState(false);
  const [isViewerMenuOpen,     setIsViewerMenuOpen]     = useState(false);

  const measureMenuRef = useRef<HTMLDivElement>(null);
  const viewerMenuRef  = useRef<HTMLDivElement>(null);

  const getStudyTitle = useCallback((s: StudyItem) => {
    const ml:Record<string,string>={CT:"Tomografía",MR:"Resonancia Magnética",CR:"Radiografía",US:"Ultrasonido",PT:"PET",NM:"Medicina Nuclear"};
    return `${ml[s.modality]??s.modality} — ${s.bodyPart||"Sin especificar"}`;
  },[]);

  const parseSpacing = (v: unknown): {x:number;y:number}|null => {
    if(!v) return null;
    if(Array.isArray(v)&&v.length>=2){const x=Number(v[0]),y=Number(v[1]);if(!isNaN(x)&&!isNaN(y))return{x,y};}
    if(typeof v==="string"){const p=v.split(/[\\,\s]+/).map(Number).filter(n=>!isNaN(n));if(p.length>=2)return{x:p[0],y:p[1]};}
    return null;
  };

  const fetchForPanel = useCallback(async (pidx: number, studyId: string) => {
    setPanels(prev=>{const n=[...prev];n[pidx]={...n[pidx],loading:true,loadingProgress:0,images:[],instanceIds:[],spacingByInstance:{},currentIndex:0,pixelSpacing:null,panOffset:{x:0,y:0},brightness:256,contrast:256,rotation:0,zoom:1,inverted:false,cineActive:false};return n;});
    try {
      const res = await axios.get<{images:ImageData[]}>(`${API_BASE}/orthanc-proxy/studies/${studyId}/instances/`);
      const origin=API_BASE.replace(/\/api$/,"");
      const urls=res.data.images.map(img=>img.imageUrl.startsWith("http")?img.imageUrl:`${origin}${img.imageUrl}`);
      const ids=res.data.images.map(img=>img.instanceId??"");
      const sm:Record<string,{x:number;y:number}>={};
      res.data.images.forEach(img=>{if(!img.instanceId)return;const sp=parseSpacing(img.pixelSpacing)??parseSpacing(img.imagerPixelSpacing);if(sp)sm[img.instanceId]=sp;});
      setPanels(prev=>{const n=[...prev];n[pidx]={...n[pidx],studyId,images:urls,instanceIds:ids,spacingByInstance:sm,loading:false,pixelSpacing:sm[ids[0]]??null};return n;});
      // preload
      let loaded=0; const total=urls.length;
      const cache:Record<number,HTMLImageElement>={};
      const preload=(i:number)=>new Promise<void>(r=>{if(cache[i]?.complete){r();return;}const el=cache[i]??new Image();const d=()=>{el.onload=null;el.onerror=null;r();};el.onload=d;el.onerror=d;el.src=urls[i];cache[i]=el;});
      let cur=0; const conc=Math.min(6,total);
      const worker=async()=>{while(cur<total){const qi=cur++;await preload(qi);loaded++;setPanels(prev=>{const n=[...prev];n[pidx]={...n[pidx],loadingProgress:Math.floor((loaded/total)*100)};return n;});}};
      await Promise.all(Array.from({length:conc},()=>worker()));
    } catch(err){console.error(err);setPanels(prev=>{const n=[...prev];n[pidx]={...n[pidx],loading:false};return n;});}
  },[]);

  useEffect(()=>{ fetchForPanel(0, tomography.orthancStudyId||DEMO_STUDY_ID); },[tomography.orthancStudyId]);

  const updatePanel = useCallback((idx:number)=>(fn:(p:PanelState)=>PanelState)=>{
    setPanels(prev=>{const n=[...prev];n[idx]=fn(n[idx]);return n;});
  },[]);

  const handleCommit = (pidx:number,item:MeasurementItem)=>{
    const k=`${panels[pidx].studyId}:${panels[pidx].currentIndex}`;
    setMeasurementsByImage(prev=>({...prev,[k]:[...(prev[k]??[]),item]}));
  };

  const handleDelete = (pidx:number,id:string)=>{
    const k=`${panels[pidx].studyId}:${panels[pidx].currentIndex}`;
    setMeasurementsByImage(prev=>({...prev,[k]:(prev[k]??[]).filter(m=>m.id!==id)}));
  };

  const handleDrop = useCallback((pidx:number,studyId:string)=>{fetchForPanel(pidx,studyId);},[fetchForPanel]);

  const handleCapture = useCallback(async()=>{
    const panel=panels[activePanel]; if(!panel.images.length) return;
    const stageEl=document.querySelector(`[data-panel="${activePanel}"]`) as HTMLElement;
    const imgEl=stageEl?.querySelector("img") as HTMLImageElement|null;
    const svgEl=stageEl?.querySelector("svg") as SVGSVGElement|null;
    if(!imgEl) return;
    const ir=imgEl.getBoundingClientRect(),sr=stageEl.getBoundingClientRect();
    const dr={x:ir.left-sr.left,y:ir.top-sr.top,width:ir.width,height:ir.height};
    const sc=2,canvas=document.createElement("canvas");
    canvas.width=dr.width*sc;canvas.height=dr.height*sc;
    const ctx=canvas.getContext("2d")!;
    ctx.fillStyle="#000";ctx.fillRect(0,0,canvas.width,canvas.height);
    const src=new Image();src.crossOrigin="anonymous";src.src=panel.images[panel.currentIndex];
    await new Promise<void>(r=>{if(src.complete)r();else{src.onload=()=>r();src.onerror=()=>r();}});
    ctx.filter=toFilter(panel.brightness,panel.contrast,panel.inverted);
    ctx.drawImage(src,0,0,canvas.width,canvas.height);ctx.filter="none";
    if(svgEl){
      const cl=svgEl.cloneNode(true) as SVGSVGElement;
      cl.setAttribute("viewBox",`${dr.x} ${dr.y} ${dr.width} ${dr.height}`);
      cl.setAttribute("width",String(dr.width*sc));cl.setAttribute("height",String(dr.height*sc));
      const blob=new Blob([new XMLSerializer().serializeToString(cl)],{type:"image/svg+xml"});
      const url=URL.createObjectURL(blob);
      await new Promise<void>(r=>{const ov=new Image();ov.onload=()=>{ctx.drawImage(ov,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);r();};ov.onerror=()=>{URL.revokeObjectURL(url);r();};ov.src=url;});
    }
    ctx.font=`${11*sc}px monospace`;
    ctx.fillStyle="rgba(0,0,0,0.6)";ctx.fillRect(0,canvas.height-50*sc,260*sc,50*sc);
    ctx.fillStyle="#e2e8f0";
    ctx.fillText(`Slice: ${panel.currentIndex+1}/${panel.images.length}`,8*sc,canvas.height-32*sc);
    ctx.fillText(panel.pixelSpacing?`${panel.pixelSpacing.x.toFixed(3)}×${panel.pixelSpacing.y.toFixed(3)} mm/px`:"sin calibración DICOM",8*sc,canvas.height-16*sc);
    canvas.toBlob(blob=>{if(!blob)return;const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`tomografia_slice_${panel.currentIndex+1}.png`;a.click();},"image/png");
  },[panels,activePanel]);

  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{
      if(e.key==="Escape"){setMeasurementMode(null);setActiveTool(null);setIsMeasureMenuOpen(false);setIsViewerMenuOpen(false);setIsLayoutMenuOpen(false);}
      if(e.key==="ArrowRight"||e.key==="ArrowDown") updatePanel(activePanel)(p=>p.currentIndex<p.images.length-1?{...p,currentIndex:p.currentIndex+1}:p);
      if(e.key==="ArrowLeft" ||e.key==="ArrowUp")   updatePanel(activePanel)(p=>p.currentIndex>0?{...p,currentIndex:p.currentIndex-1}:p);
    };
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[activePanel,updatePanel]);

  useEffect(()=>{
    const h=(e:MouseEvent)=>{
      if(measureMenuRef.current&&!measureMenuRef.current.contains(e.target as Node))setIsMeasureMenuOpen(false);
      if(viewerMenuRef.current &&!viewerMenuRef.current.contains(e.target  as Node))setIsViewerMenuOpen(false);
      if(layoutMenuRef.current &&!layoutMenuRef.current.contains(e.target  as Node))setIsLayoutMenuOpen(false);
    };
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);

  useEffect(()=>{
    const bo=document.body.style.overflow,ho=document.documentElement.style.overflow;
    document.body.style.overflow=document.documentElement.style.overflow="hidden";
    return()=>{document.body.style.overflow=bo;document.documentElement.style.overflow=ho;};
  },[]);

  const gridCls = layoutMode===1?"grid-cols-1 grid-rows-1":layoutMode===2?"grid-cols-2 grid-rows-1":"grid-cols-2 grid-rows-2";
  const visible = layoutMode===1?1:layoutMode===2?2:4;
  const activeP = panels[activePanel];

  const measurementOptions = [
    {label:"Longitudinal",  mode:"longitudinal"  as const,icon:<Ruler className="h-4 w-4" strokeWidth={1.8}/>},
    {label:"Bidireccional", mode:"bidirectional" as const,icon:<ArrowLeftRight className="h-4 w-4" strokeWidth={1.8}/>},
    {label:"Annotation",    mode:"annotation"    as const,icon:<Pencil className="h-4 w-4" strokeWidth={1.8}/>},
    {label:"Elipse",        mode:"ellipse"       as const,icon:<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><ellipse cx="12" cy="12" rx="8" ry="5" strokeWidth="2"/></svg>},
    {label:"Rectángulo",    mode:"rectangle"     as const,icon:<Square className="h-4 w-4" strokeWidth={1.8}/>},
    {label:"Círculo",       mode:"circle"        as const,icon:<Circle className="h-4 w-4" strokeWidth={1.8}/>},
    {label:"Freehand ROI",  mode:"freehand"      as const,icon:<PenTool className="h-4 w-4" strokeWidth={1.8}/>},
  ];

  return (
    <div className="bg-gray-900 text-white flex flex-col h-[calc(100vh-9rem)] max-h-[calc(100vh-9rem)] min-h-0 rounded-xl shadow-lg overflow-hidden" style={{overscrollBehavior:"none"}}>

      {/* ── Header ── */}
      <div className="bg-black px-5 border-b border-gray-700 shrink-0">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">{cleanedTitle||"Tomografía"}</h1>
              <p className="text-sm text-gray-400">Fecha: {tomography.date}</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 text-slate-300">
            {/* Ruler */}
            <button type="button" title="Medición longitudinal"
              onClick={()=>{setMeasurementMode(p=>p?null:"longitudinal");setActiveTool(null);}}
              className={`h-9 w-9 rounded-md transition-colors flex items-center justify-center ${measurementMode?"bg-yellow-500/20 text-yellow-300":"hover:bg-white/10"}`}>
              <Ruler className="h-5 w-5" strokeWidth={1.8}/>
            </button>

            {/* Measurement dropdown */}
            <div className="relative" ref={measureMenuRef}>
              <button type="button" className="h-9 px-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center justify-center"
                onClick={()=>{setIsMeasureMenuOpen(p=>!p);setIsViewerMenuOpen(false);setIsLayoutMenuOpen(false);}}>
                <ChevronDown className={`h-4 w-4 transition-transform ${isMeasureMenuOpen?"rotate-180":""}`} strokeWidth={2}/>
              </button>
              {isMeasureMenuOpen&&(
                <div className="absolute right-0 top-11 z-40 w-56 rounded-xl border border-slate-700 bg-[#0f172a] p-2 shadow-2xl">
                  <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Medición</p>
                  {measurementOptions.map(o=>(
                    <button key={o.label} type="button"
                      onClick={()=>{setMeasurementMode(o.mode);setActiveTool(null);setIsMeasureMenuOpen(false);}}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${measurementMode===o.mode?"bg-yellow-500/15 text-yellow-300":"text-slate-200 hover:bg-slate-700/70"}`}>
                      <span className={measurementMode===o.mode?"text-yellow-400":"text-slate-300"}>{o.icon}</span>
                      <span>{o.label}</span>
                      {measurementMode===o.mode&&<span className="ml-auto text-yellow-400 text-xs">●</span>}
                    </button>
                  ))}
                  {Object.keys(measurementsByImage).some(k=>measurementsByImage[k].length>0)&&(
                    <><div className="my-2 border-t border-slate-700"/>
                    <button type="button" onClick={()=>{setMeasurementsByImage({});setIsMeasureMenuOpen(false);}}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      Limpiar todas
                    </button></>
                  )}
                </div>
              )}
            </div>

            <span className="mx-1 h-6 w-px bg-slate-500/40"/>

            {/* Pan */}
            <button type="button" title="Mover imagen — arrastra para desplazar"
              onClick={()=>{setActiveTool(p=>p==="pan"?null:"pan");setMeasurementMode(null);}}
              className={`h-9 w-9 rounded-md transition-colors flex items-center justify-center ${activeTool==="pan"?"bg-sky-500/20 text-sky-300":"hover:bg-white/10"}`}>
              <Move className="h-5 w-5" strokeWidth={1.8}/>
            </button>

            {/* Contrast — OHIF style */}
            <button type="button"
              title="Brillo/Contraste — arrastra: horizontal=contraste, vertical=brillo"
              onClick={()=>{setActiveTool(p=>p==="contrast"?null:"contrast");setMeasurementMode(null);}}
              className={`h-9 w-9 rounded-md transition-colors flex items-center justify-center ${activeTool==="contrast"?"bg-purple-500/20 text-purple-300":"hover:bg-white/10"}`}>
              <Contrast className="h-5 w-5" strokeWidth={1.8}/>
            </button>

            {/* Camera */}
            <button type="button" title="Capturar imagen con anotaciones" onClick={handleCapture}
              className="h-9 w-9 rounded-md hover:bg-white/10 transition-colors flex items-center justify-center">
              <Camera className="h-5 w-5" strokeWidth={1.8}/>
            </button>

            {/* Layout */}
            <div className="relative" ref={layoutMenuRef}>
              <button type="button" title="Distribución de paneles"
                onClick={()=>{setIsLayoutMenuOpen(p=>!p);setIsMeasureMenuOpen(false);setIsViewerMenuOpen(false);}}
                className={`h-9 w-9 rounded-md transition-colors flex items-center justify-center ${layoutMode>1?"bg-emerald-500/20 text-emerald-300":"hover:bg-white/10"}`}>
                <LayoutGrid className="h-5 w-5" strokeWidth={1.8}/>
              </button>
              {isLayoutMenuOpen&&(
                <div className="absolute right-0 top-11 z-40 w-56 rounded-xl border border-slate-700 bg-[#0f172a] p-3 shadow-2xl">
                  <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Distribución de paneles</p>
                  {([1,2,4] as LayoutMode[]).map(n=>{
                    const labels:Record<LayoutMode,string>={1:"Un panel",2:"Dos paneles (2×1)",4:"Cuatro paneles (2×2)"};
                    const icons:Record<LayoutMode,React.ReactNode>={
                      1:<div className="w-7 h-7 border-2 border-current rounded"/>,
                      2:<div className="w-7 h-7 border-2 border-current rounded grid grid-cols-2"><div className="border-r-2 border-current"/><div/></div>,
                      4:<div className="w-7 h-7 border-2 border-current rounded grid grid-cols-2 grid-rows-2"><div className="border-r-2 border-b-2 border-current"/><div className="border-b-2 border-current"/><div className="border-r-2 border-current"/><div/></div>,
                    };
                    return (
                      <button key={n} type="button"
                        onClick={()=>{setLayoutMode(n);setIsLayoutMenuOpen(false);if(n===1)setActivePanel(0);}}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${layoutMode===n?"bg-emerald-500/15 text-emerald-300":"text-slate-200 hover:bg-slate-700/70"}`}>
                        <span className={layoutMode===n?"text-emerald-400":"text-slate-500"}>{icons[n]}</span>
                        <span>{labels[n]}</span>
                        {layoutMode===n&&<span className="ml-auto text-emerald-400 text-xs">●</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reset view */}
            <button type="button" title="Resetear vista del panel activo"
              onClick={()=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],panOffset:{x:0,y:0},brightness:256,contrast:256,rotation:0,zoom:1,inverted:false,cineActive:false};return n;})}
              className="h-9 w-9 rounded-md hover:bg-white/10 transition-colors flex items-center justify-center">
              <RotateCcw className="h-5 w-5" strokeWidth={1.8}/>
            </button>

            <span className="mx-1 h-6 w-px bg-slate-500/40"/>

            {/* Viewer dropdown — Cine, Rotate, Negative, Zoom */}
            <div className="relative" ref={viewerMenuRef}>
              <button type="button" title="Herramientas del visor"
                className="h-9 w-9 rounded-md hover:bg-white/10 transition-colors flex items-center justify-center"
                onClick={()=>{setIsViewerMenuOpen(p=>!p);setIsMeasureMenuOpen(false);setIsLayoutMenuOpen(false);}}>
                <ChevronDown className={`h-4 w-4 transition-transform ${isViewerMenuOpen ? "rotate-180" : ""}`} strokeWidth={2}/>
              </button>
              {isViewerMenuOpen&&(
                <div className="absolute right-0 top-11 z-40 w-64 rounded-xl border border-slate-700 bg-[#0f172a] p-3 shadow-2xl">
                  <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Herramientas del visor</p>

                  {/* ── CINE ── */}
                  <div className="mb-2 rounded-lg border border-slate-700/60 bg-slate-800/40 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Cine</p>
                    <div className="flex items-center gap-2">
                      <button type="button"
                        onClick={()=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],cineActive:!n[activePanel].cineActive};return n;})}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${activeP.cineActive ? "bg-indigo-500/15 text-indigo-200" : "bg-slate-700 text-slate-200 hover:bg-slate-600"}`}>
                        {activeP.cineActive?(
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                        ):(
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                        {activeP.cineActive?"Pausar":"Reproducir"}
                      </button>
                      <div className="flex items-center gap-1 ml-auto">
                        <button type="button" onClick={()=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],cineFps:Math.max(1,n[activePanel].cineFps-2)};return n;})}
                          className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm flex items-center justify-center font-bold">−</button>
                        <span className="text-xs text-slate-300 w-12 text-center">{activeP.cineFps} fps</span>
                        <button type="button" onClick={()=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],cineFps:Math.min(60,n[activePanel].cineFps+2)};return n;})}
                          className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm flex items-center justify-center font-bold">+</button>
                      </div>
                    </div>
                    {activeP.cineActive&&(
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-1 overflow-hidden">
                          <div className="h-full bg-indigo-400 transition-all duration-100"
                            style={{width:`${((activeP.currentIndex+1)/Math.max(1,activeP.images.length))*100}%`}}/>
                        </div>
                        <span className="text-[10px] text-slate-400">{activeP.currentIndex+1}/{activeP.images.length}</span>
                      </div>
                    )}
                  </div>

                  {/* ── GIRAR ── */}
                  <div className="mb-2 rounded-lg border border-slate-700/60 bg-slate-800/40 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Girar</p>
                    <div className="flex items-center gap-2">
                      <button type="button" title="Girar 90° izquierda"
                        onClick={()=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],rotation:(n[activePanel].rotation-90+360)%360};return n;})}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-200 bg-slate-700 hover:bg-slate-600 transition-colors">
                        <RotateCcw className="h-3.5 w-3.5"/> −90°
                      </button>
                      <span className="text-xs text-slate-400 w-10 text-center">{activeP.rotation}°</span>
                      <button type="button" title="Girar 90° derecha"
                        onClick={()=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],rotation:(n[activePanel].rotation+90)%360};return n;})}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-200 bg-slate-700 hover:bg-slate-600 transition-colors">
                        <RotateCw className="h-3.5 w-3.5"/> +90°
                      </button>
                    </div>
                  </div>

                  {/* ── NEGATIVO ── */}
                  <button type="button"
                    onClick={()=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],inverted:!n[activePanel].inverted};return n;})}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors bg-slate-700/60 text-slate-200 hover:bg-slate-600">
                    <Contrast className="h-4 w-4" strokeWidth={1.8}/>
                    <span>Negativo (invertir colores)</span>
                    {activeP.inverted&&<span className="ml-auto text-amber-400 text-xs">●</span>}
                  </button>

                  {/* ── ZOOM ── */}
                  <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Zoom</p>
                    <div className="flex items-center gap-2">
                      <button type="button"
                        onClick={()=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],zoom:Math.max(0.25,+(n[activePanel].zoom-0.25).toFixed(2))};return n;})}
                        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors">
                        <ZoomOut className="h-4 w-4" strokeWidth={1.8}/>
                      </button>
                      <div className="flex-1">
                        <input type="range" min={25} max={400} step={25}
                          value={Math.round(activeP.zoom*100)}
                          onChange={e=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],zoom:Number(e.target.value)/100};return n;})}
                          className="w-full accent-indigo-400 h-1.5"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500 mt-0.5"><span>25%</span><span className="text-slate-300 font-mono">{Math.round(activeP.zoom*100)}%</span><span>400%</span></div>
                      </div>
                      <button type="button"
                        onClick={()=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],zoom:Math.min(4,+(n[activePanel].zoom+0.25).toFixed(2))};return n;})}
                        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors">
                        <ZoomIn className="h-4 w-4" strokeWidth={1.8}/>
                      </button>
                    </div>
                    <button type="button"
                      onClick={()=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],zoom:1};return n;})}
                      className="mt-2 w-full text-center text-[10px] text-slate-500 hover:text-slate-300 transition-colors">
                      Reset zoom (100%)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active tool pills */}
        {(measurementMode||activeTool)&&(
          <div className="flex items-center gap-2 pb-2">
            {measurementMode&&(
              <div className="flex items-center gap-2 rounded-full bg-yellow-500/15 border border-yellow-500/40 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse"/>
                <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wide">{measurementOptions.find(o=>o.mode===measurementMode)?.label}</span>
                <button type="button" onClick={()=>setMeasurementMode(null)} className="ml-1 text-yellow-400 hover:text-yellow-200 text-xs leading-none">✕</button>
              </div>
            )}
            {activeTool==="contrast"&&(
              <div className="flex items-center gap-2 rounded-full bg-purple-500/15 border border-purple-500/40 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse"/>
                <span className="text-xs font-semibold text-purple-300">
                  Brillo {Math.round((activeP.brightness/256)*100)}% · Contraste {Math.round((activeP.contrast/256)*100)}%
                </span>
                <button type="button" onClick={()=>{setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],brightness:256,contrast:256};return n;});}} className="ml-1 text-purple-400 hover:text-purple-200 text-[10px] border border-purple-500/40 rounded px-1">Reset</button>
                <button type="button" onClick={()=>setActiveTool(null)} className="text-purple-400 hover:text-purple-200 text-xs leading-none">✕</button>
              </div>
            )}
            {activeTool==="pan"&&(
              <div className="flex items-center gap-2 rounded-full bg-sky-500/15 border border-sky-500/40 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse"/>
                <span className="text-xs font-semibold text-sky-300">Mover imagen</span>
                <button type="button" onClick={()=>setActiveTool(null)} className="ml-1 text-sky-400 hover:text-sky-200 text-xs leading-none">✕</button>
              </div>
            )}
            {activeP.cineActive&&(
              <div className="flex items-center gap-2 rounded-full bg-indigo-500/15 border border-indigo-500/40 px-3 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span className="text-xs font-semibold text-indigo-300">Cine · {activeP.cineFps} fps · {activeP.currentIndex+1}/{activeP.images.length}</span>
                <button type="button" onClick={()=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],cineActive:false};return n;})} className="ml-1 text-indigo-400 hover:text-indigo-200 text-xs leading-none">❚❚</button>
              </div>
            )}
            {activeP.inverted&&(
              <div className="flex items-center gap-2 rounded-full bg-amber-500/15 border border-amber-500/40 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"/>
                <span className="text-xs font-semibold text-amber-300">Negativo activo</span>
                <button type="button" onClick={()=>setPanels(prev=>{const n=[...prev];n[activePanel]={...n[activePanel],inverted:false};return n;})} className="ml-1 text-amber-400 hover:text-amber-200 text-xs leading-none">✕</button>
              </div>
            )}
            {(activeP.rotation!==0||activeP.zoom!==1)&&(
              <div className="flex items-center gap-2 rounded-full bg-slate-700/80 border border-slate-600 px-3 py-1">
                {activeP.rotation!==0&&<span className="text-xs font-mono text-slate-300">{activeP.rotation}°</span>}
                {activeP.zoom!==1&&<span className="text-xs font-mono text-slate-300">{Math.round(activeP.zoom*100)}%</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex-1 min-h-0 flex bg-black overflow-hidden">

        {/* Sidebar */}
        <aside className="w-60 shrink-0 border-r border-gray-800 bg-gray-950/95 flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-800">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Estudios del paciente</p>
            {layoutMode>1&&<p className="text-[10px] text-slate-500 mt-0.5">Arrastra un estudio a cualquier panel</p>}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {patientStudies.length>0?patientStudies.map(study=>{
              const isLoaded=panels.some(p=>p.studyId===study.orthancStudyId);
              const date=study.studyDate?new Date(study.studyDate).toLocaleDateString("es-MX"):"—";
              return (
                <div
                  key={study.id}
                  draggable
                  onDragStart={e=>{e.dataTransfer.setData("studyId",study.orthancStudyId);e.dataTransfer.effectAllowed="copy";}}
                  onClick={()=>fetchForPanel(activePanel,study.orthancStudyId)}
                  className={`rounded-xl border px-3 py-2.5 cursor-grab active:cursor-grabbing transition-colors select-none ${isLoaded?"border-emerald-500 bg-emerald-600/10":"border-gray-800 bg-gray-900 hover:bg-gray-800"}`}
                >
                  <p className="text-sm font-medium text-white truncate">{getStudyTitle(study)}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-400 truncate">{date}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${isLoaded?"bg-emerald-500/20 text-emerald-300":"bg-slate-700 text-slate-300"}`}>{study.status}</span>
                  </div>
                  {layoutMode>1&&<p className="text-[10px] text-slate-500 mt-1">↕ Arrastra al panel</p>}
                </div>
              );
            }):(
              <p className="px-2 py-4 text-sm text-slate-400 text-center">Sin estudios registrados</p>
            )}
          </div>
        </aside>

        {/* Panel grid */}
        <div className={`flex-1 min-w-0 min-h-0 grid ${gridCls} gap-px bg-gray-800`}>
          {Array.from({length:visible}).map((_,idx)=>(
            <div key={idx} className="min-w-0 min-h-0 flex">
              <SinglePanel
                panel={panels[idx]}
                panelIndex={idx}
                isActive={activePanel===idx}
                activeTool={activeTool}
                measurementMode={measurementMode}
                measurementsByImage={measurementsByImage}
                onActivate={()=>setActivePanel(idx)}
                onPanelUpdate={updatePanel(idx)}
                onCommit={handleCommit}
                onDelete={handleDelete}
                onDrop={handleDrop}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}