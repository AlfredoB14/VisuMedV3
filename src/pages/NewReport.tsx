import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import { getPatients, getStudies, getReports, getReport, createReport, updateReport } from '../services/api';
import type { Patient, Study, Report } from '../services/api';
import { useAppSelector } from '../redux/hooks';
import { selectDoctor } from '../redux/auth/auth.slice';

const MODALITY_LABEL: Record<string, string> = {
  MR: 'Resonancia Magnética',
  CT: 'Tomografía Computarizada',
  CR: 'Radiografía',
  US: 'Ultrasonido',
  PT: 'PET',
  NM: 'Medicina Nuclear',
};

function modalityLabel(mod: string) {
  return MODALITY_LABEL[mod] || mod || 'Estudio';
}

function buildShareLink(report: Report): string {
  return `visumed://report/${report.id}?token=${report.shareToken}`;
}

function buildQrUrl(link: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(link)}`;
}

export default function NewReport() {
  const doctor = useAppSelector(selectDoctor);
  const [searchParams] = useSearchParams();

  // Patient / study selectors
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [studies, setStudies] = useState<Study[]>([]);
  const [selectedStudyId, setSelectedStudyId] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    nombreEstudio: '',
    tecnicaEstudio: '',
    fechaEstudio: '',
    indicacionEstudio: '',
    hallazgos: '',
    estudiosPrevios: '',
    conclusiones: [] as string[],
    sugerencias: [] as string[],
  });
  const [nuevaConclusion, setNuevaConclusion] = useState('');
  const [nuevaSugerencia, setNuevaSugerencia] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingStudies, setLoadingStudies] = useState(false);
  const [error, setError] = useState('');
  const [savedReport, setSavedReport] = useState<Report | null>(null);
  const [isSigned, setIsSigned] = useState(false);

  // If ?reportId= is in URL, load that report directly (most reliable path from PatientDetail)
  useEffect(() => {
    const reportId = searchParams.get('reportId');
    if (!reportId) return;
    getReport(reportId)
      .then(loadExistingReport)
      .catch(() => { /* report not found — form stays blank */ });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load patients on mount; pre-select if ?patientId= is in URL
  useEffect(() => {
    setLoadingPatients(true);
    getPatients(doctor?.id ? { doctorId: doctor.id } : undefined)
      .then((data) => {
        setPatients(data);
        const preselect = searchParams.get('patientId');
        if (preselect && data.find((p) => p.id === preselect)) {
          setSelectedPatientId(preselect);
        }
      })
      .catch(() => setError('No se pudieron cargar los pacientes.'))
      .finally(() => setLoadingPatients(false));
  }, [doctor?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load studies when patient changes
  useEffect(() => {
    if (!selectedPatientId) {
      setStudies([]);
      setSelectedStudyId('');
      return;
    }
    setLoadingStudies(true);
    const preSelectStudyId = searchParams.get('studyId');
    getStudies({ patientId: selectedPatientId })
      .then((data) => {
        setStudies(data);
        const target = preSelectStudyId ? data.find(s => s.id === preSelectStudyId) ?? null : null;
        const first = target || (data.length > 0 ? data[0] : null);
        if (target) {
          setSelectedStudyId(target.id);
          // Only fetch by studyId if we didn't already load by reportId
          if (!searchParams.get('reportId')) {
            fetchReportForStudy(target.id);
          }
        } else {
          setSelectedStudyId('');
        }
        if (first && !searchParams.get('reportId')) {
          setFormData((prev) => ({
            ...prev,
            nombreEstudio: prev.nombreEstudio || modalityLabel(first.modality) + (first.bodyPart ? ` — ${first.bodyPart}` : ''),
            fechaEstudio: prev.fechaEstudio || (first.studyDate ? first.studyDate.substring(0, 10) : ''),
          }));
        }
      })
      .catch(() => setError('No se pudieron cargar los estudios del paciente.'))
      .finally(() => setLoadingStudies(false));
  }, [selectedPatientId]);

  // Populate the form with an existing report's data
  const loadExistingReport = (r: Report) => {
    setSavedReport(r);
    setIsSigned(r.status === 'signed');
    setFormData({
      nombreEstudio:      r.studyName     || '',
      tecnicaEstudio:     r.technique     || '',
      fechaEstudio:       r.studyDate     ? r.studyDate.substring(0, 10) : '',
      indicacionEstudio:  r.indication    || '',
      hallazgos:          r.findings      || '',
      estudiosPrevios:    r.priorStudies  || '',
      conclusiones:       r.conclusions   ? r.conclusions.split('\n').filter(Boolean) : [],
      sugerencias:        r.suggestions   ? r.suggestions.split('\n').filter(Boolean) : [],
    });
  };

  // Fetch existing report for a study, if any
  const fetchReportForStudy = async (studyId: string) => {
    try {
      const reports = await getReports({ studyId });
      if (reports.length > 0) loadExistingReport(reports[0]);
    } catch { /* no report yet — leave form blank */ }
  };

  // Auto-fill when study selection changes
  const handleStudyChange = (studyId: string) => {
    setSelectedStudyId(studyId);
    setSavedReport(null);
    setIsSigned(false);
    if (!studyId) return;
    const study = studies.find((s) => s.id === studyId);
    if (!study) return;
    setFormData((prev) => ({
      ...prev,
      nombreEstudio: modalityLabel(study.modality) + (study.bodyPart ? ` — ${study.bodyPart}` : ''),
      fechaEstudio: study.studyDate ? study.studyDate.substring(0, 10) : prev.fechaEstudio,
    }));
    fetchReportForStudy(studyId);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const agregarConclusion = () => {
    if (!nuevaConclusion.trim()) return;
    setFormData((prev) => ({ ...prev, conclusiones: [...prev.conclusiones, nuevaConclusion.trim()] }));
    setNuevaConclusion('');
  };

  const eliminarConclusion = (index: number) => {
    setFormData((prev) => ({ ...prev, conclusiones: prev.conclusiones.filter((_, i) => i !== index) }));
  };

  const agregarSugerencia = () => {
    if (!nuevaSugerencia.trim()) return;
    setFormData((prev) => ({ ...prev, sugerencias: [...prev.sugerencias, nuevaSugerencia.trim()] }));
    setNuevaSugerencia('');
  };

  const eliminarSugerencia = (index: number) => {
    setFormData((prev) => ({ ...prev, sugerencias: prev.sugerencias.filter((_, i) => i !== index) }));
  };

  const generarReporte = async (sign = false) => {
    if (!selectedStudyId) {
      setError('Selecciona un estudio para generar el reporte.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = {
        studyId: selectedStudyId,
        doctorId: doctor?.id,
        studyName: formData.nombreEstudio,
        technique: formData.tecnicaEstudio,
        studyDate: formData.fechaEstudio || undefined,
        indication: formData.indicacionEstudio,
        findings: formData.hallazgos,
        priorStudies: formData.estudiosPrevios,
        conclusions: formData.conclusiones.join('\n'),
        suggestions: formData.sugerencias.join('\n'),
        status: sign ? 'signed' : 'draft',
      };

      let report: Report;
      if (savedReport) {
        report = await updateReport(savedReport.id, payload);
      } else {
        report = await createReport(payload);
      }

      setSavedReport(report);
      if (sign) setIsSigned(true);
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Error al guardar el reporte. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!savedReport?.shareToken) return;
    const link = buildShareLink(savedReport);
    navigator.clipboard.writeText(link).catch(() => {});
  };

  const selectedStudy = studies.find((s) => s.id === selectedStudyId);

  return (
    <>
      <PageMeta title="VisuMed | Nuevo Reporte" description="Generación de nuevo reporte médico" />
      <PageBreadcrumb pageTitle="Registro de Nuevo Reporte" />

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">

        {/* ── Patient & Study selector ──────────────────────────────── */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="mb-6 border-b border-slate-200 pb-3 text-2xl font-bold text-[#26a69a] dark:border-slate-800">
            Paciente y Estudio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">
                Paciente
              </label>
              {loadingPatients ? (
                <p className="text-sm text-slate-400">Cargando pacientes…</p>
              ) : (
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                >
                  <option value="">— Seleccionar paciente —</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                      {p.email ? ` (${p.email})` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">
                Estudio
              </label>
              {loadingStudies ? (
                <p className="text-sm text-slate-400">Cargando estudios…</p>
              ) : (
                <select
                  value={selectedStudyId}
                  onChange={(e) => handleStudyChange(e.target.value)}
                  disabled={!selectedPatientId}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white disabled:opacity-50"
                >
                  <option value="">— Seleccionar estudio —</option>
                  {studies.map((s) => (
                    <option key={s.id} value={s.id}>
                      {modalityLabel(s.modality)}
                      {s.bodyPart ? ` — ${s.bodyPart}` : ''}
                      {s.studyDate ? ` (${s.studyDate.substring(0, 10)})` : ''}
                      {` · ${s.status}`}
                    </option>
                  ))}
                </select>
              )}
              {selectedPatientId && studies.length === 0 && !loadingStudies && (
                <p className="mt-1 text-xs text-slate-400">No hay estudios para este paciente.</p>
              )}
            </div>
          </div>

          {selectedStudy && (
            <div className="mt-4 rounded-xl bg-[#26a69a]/8 border border-[#26a69a]/20 p-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium text-[#26a69a]">Estudio seleccionado:</span>{' '}
              {modalityLabel(selectedStudy.modality)}
              {selectedStudy.bodyPart ? ` — ${selectedStudy.bodyPart}` : ''}{' '}
              · ID Orthanc:{' '}
              <code className="text-xs">{selectedStudy.orthancStudyId}</code>
            </div>
          )}
        </div>

        {/* ── Study info ───────────────────────────────────────────── */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="mb-6 border-b border-slate-200 pb-3 text-2xl font-bold text-[#26a69a] dark:border-slate-800">
            Información del Estudio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Nombre del Estudio</label>
              <input
                type="text"
                name="nombreEstudio"
                value={formData.nombreEstudio}
                onChange={handleChange}
                placeholder="Ej: Radiografía de tórax"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Técnica del Estudio</label>
              <input
                type="text"
                name="tecnicaEstudio"
                value={formData.tecnicaEstudio}
                onChange={handleChange}
                placeholder="Ej: Tomografía multicorte"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Fecha del Estudio</label>
              <input
                type="date"
                name="fechaEstudio"
                value={formData.fechaEstudio}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* ── Study details ────────────────────────────────────────── */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="mb-6 border-b border-slate-200 pb-3 text-2xl font-bold text-[#26a69a] dark:border-slate-800">
            Detalles del Estudio
          </h2>

          <div className="mb-6">
            <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Indicación del Estudio</label>
            <textarea
              name="indicacionEstudio"
              value={formData.indicacionEstudio}
              onChange={handleChange}
              rows={2}
              placeholder="Motivo por el que se realiza el estudio"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Hallazgos</label>
            <textarea
              name="hallazgos"
              value={formData.hallazgos}
              onChange={handleChange}
              rows={5}
              placeholder="Descripción detallada de los hallazgos (uno por línea)"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
            />
            <p className="mt-1 text-xs text-slate-400">Cada línea aparecerá como un punto individual en la app del paciente.</p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Estudios Previos</label>
            <textarea
              name="estudiosPrevios"
              value={formData.estudiosPrevios}
              onChange={handleChange}
              rows={2}
              placeholder="Información de estudios anteriores relacionados"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
            />
          </div>
        </div>

        {/* ── Conclusions & Suggestions ────────────────────────────── */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="mb-6 border-b border-slate-200 pb-3 text-2xl font-bold text-[#26a69a] dark:border-slate-800">
            Conclusiones y Sugerencias
          </h2>

          {/* Conclusiones */}
          <div className="mb-8">
            <label className="mb-3 block font-medium text-slate-700 dark:text-slate-400">Conclusiones</label>
            <div className="flex mb-3">
              <input
                type="text"
                value={nuevaConclusion}
                onChange={(e) => setNuevaConclusion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarConclusion())}
                className="flex-grow rounded-l-full border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                placeholder="Agregar nueva conclusión"
              />
              <button
                onClick={agregarConclusion}
                className="rounded-r-full bg-[#26a69a] px-6 py-3 font-medium text-white transition-all hover:bg-[#1f8c81]"
              >
                Agregar
              </button>
            </div>
            {formData.conclusiones.length > 0 ? (
              <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {formData.conclusiones.map((c, i) => (
                  <li key={i} className="flex items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-950/40">
                    <span className="flex-grow text-slate-700 dark:text-slate-300">{c}</span>
                    <button
                      onClick={() => eliminarConclusion(i)}
                      className="ml-3 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 italic text-slate-500">No hay conclusiones agregadas</p>
            )}
          </div>

          {/* Sugerencias */}
          <div className="mb-4">
            <label className="mb-3 block font-medium text-slate-700 dark:text-slate-400">Sugerencias</label>
            <div className="flex mb-3">
              <input
                type="text"
                value={nuevaSugerencia}
                onChange={(e) => setNuevaSugerencia(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarSugerencia())}
                className="flex-grow rounded-l-full border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                placeholder="Agregar nueva sugerencia"
              />
              <button
                onClick={agregarSugerencia}
                className="rounded-r-full bg-[#26a69a] px-6 py-3 font-medium text-white transition-all hover:bg-[#1f8c81]"
              >
                Agregar
              </button>
            </div>
            {formData.sugerencias.length > 0 ? (
              <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {formData.sugerencias.map((s, i) => (
                  <li key={i} className="flex items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-950/40">
                    <span className="flex-grow text-slate-700 dark:text-slate-300">{s}</span>
                    <button
                      onClick={() => eliminarSugerencia(i)}
                      className="ml-3 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 italic text-slate-500">No hay sugerencias agregadas</p>
            )}
          </div>
        </div>

        {/* ── Error ────────────────────────────────────────────────── */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* ── Action buttons ───────────────────────────────────────── */}
        <div className="flex flex-wrap justify-end gap-4">
          <button
            onClick={() => generarReporte(false)}
            disabled={loading || !selectedStudyId}
            className="rounded-full border border-[#26a69a] px-6 py-3 font-semibold text-[#26a69a] transition-all hover:bg-[#26a69a]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando…' : 'Guardar borrador'}
          </button>
          <button
            onClick={() => generarReporte(true)}
            disabled={loading || !selectedStudyId || isSigned}
            className="rounded-full bg-[#26a69a] px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-[#1f8c81] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando…' : isSigned ? 'Reporte firmado ✓' : 'Generar y firmar reporte'}
          </button>
        </div>

        {/* ── Share section (shown after save) ─────────────────────── */}
        {savedReport && (
          <div className="rounded-[2rem] border-2 border-[#26a69a]/30 bg-[#26a69a]/5 p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-[#26a69a]">
              {isSigned ? '✓ Reporte firmado — Compartir con el paciente' : 'Reporte guardado — Compartir con el paciente'}
            </h2>

            <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
              El paciente puede escanear el código QR con la app VisuMed o hacer clic en el enlace para ver el reporte directamente.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* QR Code */}
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <img
                    src={buildQrUrl(buildShareLink(savedReport))}
                    alt="QR del reporte"
                    width={220}
                    height={220}
                    className="block"
                  />
                </div>
                <p className="text-xs text-slate-500">Escanear con VisuMed App</p>
              </div>

              {/* Link */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-400">
                    Enlace del reporte
                  </label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={buildShareLink(savedReport)}
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-mono text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="rounded-xl border border-[#26a69a] bg-white px-4 py-3 text-sm font-medium text-[#26a69a] hover:bg-[#26a69a]/10 transition-colors dark:bg-transparent"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-white/80 border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300 space-y-1">
                  <p><span className="font-medium">ID del reporte:</span> <code className="text-xs">{savedReport.id}</code></p>
                  <p><span className="font-medium">Estado:</span> {savedReport.status === 'signed' ? '✓ Firmado' : 'Borrador'}</p>
                  <p><span className="font-medium">Creado:</span> {new Date(savedReport.createdAt).toLocaleString('es-MX')}</p>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                  <span className="font-semibold">Aviso de responsabilidad:</span> VisuMed no se hace responsable del uso indebido de este enlace ni de con quién sea compartido. Es responsabilidad del médico compartirlo únicamente con el paciente correspondiente.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
