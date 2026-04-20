import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectDoctor } from '../redux/auth/auth.slice';
import { patientsSelector } from '../redux/patients/patients.selector';
import { useSelector } from 'react-redux';
import { studiesSelector } from '../redux/studies/studies.selector';
import { getStudies, createStudy, getOrthancStudies } from '../redux/studies/studies.action';
import { getReports } from '../redux/reports/reports.action';
import _reportsService from '../services/reports';

const MODALITY_LABEL: Record<string, string> = {
  MR: 'Resonancia Magnética', CT: 'Tomografía Computarizada',
  CR: 'Radiografía', US: 'Ultrasonido', PT: 'PET', NM: 'Medicina Nuclear',
};
const ml = (m: string) => MODALITY_LABEL[m] || m || '—';

const STATUS_BADGE: Record<string, string> = {
  pending:     'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed:   'bg-green-100 text-green-700',
  signed:      'bg-[#26a69a]/15 text-[#26a69a]',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente', in_progress: 'En proceso',
  completed: 'Completado', signed: 'Firmado',
};

export default function PatientDetail() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const doctor = useAppSelector(selectDoctor);
  const dispatch = useAppDispatch();

  const { patients } = useSelector(patientsSelector).ui;
  const { studies, loading: loadingStudies } = useSelector(studiesSelector).ui;
  const { orthancStudies } = useSelector(studiesSelector).ui;
  

  const [studyReportId, setStudyReportId] = useState<Record<string, string>>({}); // studyId -> reportId
  const [showAssign, setShowAssign]     = useState(false);
  const [assigning, setAssigning]       = useState(false);
  const [assignError, setAssignError]   = useState('');

  // Assign-study form state
  const [selectedOrthancId, setSelectedOrthancId] = useState('');
  const [assignModality, setAssignModality]         = useState('');
  const [assignBodyPart, setAssignBodyPart]         = useState('');
  const [assignDate, setAssignDate]                 = useState('');

  const patient = useMemo(() => {
    return patients?.find((p) => p.id === patientId) ?? null;
  }, [patients, patientId]);

  useEffect(() => {
    if (!patientId) return;
    dispatch(getStudies(patientId));
  }, [dispatch, patientId]);

  // Load patient + studies on mount, then fetch reportIds for completed/signed studies
  useEffect(() => {
    if (!studies?.length) {
      setStudyReportId({});
      return;
    }
  
    const loadStudyReportIds = async () => {
      const finishedStudies = studies.filter(
        (study) => study.status === "completed" || study.status === "signed"
      );
    
      const results = await Promise.all(
        finishedStudies.map(async (study) => {
          try {
            const reports = await dispatch(
              getReports({ studyId: study.id })
            ).unwrap();
    
            return reports.length > 0 ? [study.id, reports[0].id] as const : null;
          } catch {
            return null;
          }
        })
      );
    
      const reportMap: Record<string, string> = {};
      results.forEach((result) => {
        if (result) {
          reportMap[result[0]] = result[1];
        }
      });
    
      setStudyReportId(reportMap);
    };
  
    loadStudyReportIds();
  }, [studies]);
  

  // Load Orthanc studies when assign panel opens
  useEffect(() => {
    if (!showAssign || (orthancStudies?.length ?? 0) > 0) return;
  
    dispatch(getOrthancStudies());
  }, [dispatch, showAssign, orthancStudies]);

  // Auto-fill modality when Orthanc study is selected
  const handleOrthancSelect = (id: string) => {
    setSelectedOrthancId(id);
    const found = orthancStudies?.find(s => s.orthancId === id);
    if (found) {
      setAssignModality(found.modality || '');
      setAssignDate(found.date ? `${found.date.slice(0,4)}-${found.date.slice(4,6)}-${found.date.slice(6,8)}` : '');
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedOrthancId || !patientId) return;
  
    setAssigning(true);
    setAssignError("");
  
    try {
      await dispatch(
        createStudy({
          orthancStudyId: selectedOrthancId,
          patientId,
          referringDoctorId: doctor?.id,
          modality: assignModality,
          bodyPart: assignBodyPart,
          studyDate: assignDate || undefined,
          status: "pending",
        })
      ).unwrap();
  
      await dispatch(getStudies(patientId));
  
      setShowAssign(false);
      setSelectedOrthancId("");
      setAssignModality("");
      setAssignBodyPart("");
      setAssignDate("");
    } catch (err: any) {
      setAssignError(
        err?.response?.data?.error ??
        err?.message ??
        "Error al asignar el estudio."
      );
    } finally {
      setAssigning(false);
    }
  };

  if (loadingStudies) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#26a69a] border-t-transparent" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-16 text-center text-slate-500">
        Paciente no encontrado.{' '}
        <button onClick={() => navigate(-1)} className="text-[#26a69a] underline">Volver</button>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={`VisuMed | ${patient.firstName} ${patient.lastName}`} description="Detalle de paciente" />
      <PageBreadcrumb pageTitle={`${patient.firstName} ${patient.lastName}`} />

      <div className="mx-auto max-w-5xl space-y-6">

        {/* ── Patient card ─────────────────────────────────────────── */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#26a69a]/15 text-2xl font-bold text-[#26a69a]">
              {patient.firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-sm text-slate-500">{patient.email || '—'} · {patient.phone || '—'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            {[
              { label: 'Fecha de nacimiento', value: patient.birthDate || '—' },
              { label: 'Estado', value: patient.state || '—' },
              { label: 'Dirección', value: patient.address || '—' },
              { label: 'C.P.', value: patient.postalCode || '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-0.5 text-slate-700 dark:text-slate-300">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Studies ──────────────────────────────────────────────── */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#26a69a]">
              Estudios ({studies?.length})
            </h2>
            <button
              onClick={() => setShowAssign(v => !v)}
              className="rounded-full bg-[#26a69a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f8c81]"
            >
              {showAssign ? 'Cancelar' : '+ Asignar estudio'}
            </button>
          </div>

          {/* Assign form */}
          {showAssign && (
            <form
              onSubmit={handleAssign}
              className="mb-6 rounded-2xl border border-[#26a69a]/20 bg-[#26a69a]/5 p-5 space-y-4"
            >
              <h3 className="font-semibold text-[#26a69a]">Asignar estudio de Orthanc</h3>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-400">
                  Estudio en Orthanc
                </label>
                <select
                  value={selectedOrthancId}
                  onChange={e => handleOrthancSelect(e.target.value)}
                  required
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                >
                  <option value="">
                    {orthancStudies?.length === 0 ? 'Cargando estudios de Orthanc…' : '— Seleccionar estudio —'}
                  </option>
                  {orthancStudies?.map(s => (
                    <option key={s.orthancId} value={s.orthancId}>
                      {s.orthancId.slice(0, 12)}… · {s.modality || '?'} · {s.description || 'Sin descripción'} · {s.seriesCount} series
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-400">Modalidad</label>
                  <select
                    value={assignModality}
                    onChange={e => setAssignModality(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-[#26a69a] dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                  >
                    <option value="">— Seleccionar —</option>
                    {Object.entries(MODALITY_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>{v} ({k})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-400">Región / Parte del cuerpo</label>
                  <input
                    type="text"
                    value={assignBodyPart}
                    onChange={e => setAssignBodyPart(e.target.value)}
                    placeholder="Ej: BRAIN, CHEST…"
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-[#26a69a] dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-400">Fecha del estudio</label>
                  <input
                    type="date"
                    value={assignDate}
                    onChange={e => setAssignDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-[#26a69a] dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                  />
                </div>
              </div>

              {assignError && (
                <p className="text-sm text-red-500">{assignError}</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAssign(false)}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={assigning || !selectedOrthancId}
                  className="rounded-full bg-[#26a69a] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#1f8c81] disabled:opacity-50"
                >
                  {assigning ? 'Asignando…' : 'Asignar estudio'}
                </button>
              </div>
            </form>
          )}

          {/* Studies list */}
          {studies?.length === 0 ? (
            <p className="py-8 text-center text-slate-400">
              Este paciente no tiene estudios asignados todavía.
            </p>
          ) : (
            <div className="space-y-3">
              {studies?.map(study => (
                <div
                  key={study.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/40"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {ml(study.modality)}{study.bodyPart ? ` — ${study.bodyPart}` : ''}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[study.status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {STATUS_LABEL[study.status] ?? study.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {study.studyDate ? new Date(study.studyDate).toLocaleDateString('es-MX') : 'Sin fecha'} ·{' '}
                      <span className="font-mono">{study.orthancStudyId.slice(0, 16)}…</span>
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {/* Ver estudio en visor MRI */}
                    <button
                      onClick={() => {
                        const params = new URLSearchParams({
                          orthancStudyId: study.orthancStudyId,
                          title: `${study.modality}${study.bodyPart ? ' — ' + study.bodyPart : ''}`,
                          date: study.studyDate ? new Date(study.studyDate).toLocaleDateString('es-MX') : '—',
                          desc: `Estudio ${study.status}`,
                        });
                        navigate(`/study-viewer?${params.toString()}`);
                      }}
                      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300"
                    >
                      Ver estudio
                    </button>
                    {/* Crear / ver reporte */}
                    <button
                      onClick={() => {
                        const reportId = studyReportId[study.id];
                        const params = new URLSearchParams({ patientId: patientId!, studyId: study.id });
                        if (reportId) params.set('reportId', reportId);
                        navigate(`/new-report?${params.toString()}`);
                      }}
                      className="rounded-full bg-[#26a69a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f8c81]"
                    >
                      {study.status === 'completed' || study.status === 'signed' ? 'Ver reporte' : 'Crear reporte'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Quick actions ─────────────────────────────────────────── */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            ← Volver
          </button>
          <button
            onClick={() => navigate(`/new-report?patientId=${patientId}`)}
            className="rounded-full bg-[#26a69a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1f8c81]"
          >
            Nuevo reporte
          </button>
        </div>
      </div>
    </>
  );
}
