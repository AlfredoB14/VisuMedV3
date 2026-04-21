import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import { useAppDispatch } from '../redux/hooks';
import { patientsSelector } from '../redux/patients/patients.selector';
import { useSelector } from 'react-redux';
import { getStudies } from '../redux/studies/studies.action';
import _reportsService from '../services/reports';
import { StudiesTab } from './DetailTabs/StudiesTab';
import { AppointmentsTable } from './DetailTabs/AppointmentsTable';

export default function PatientDetail() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"studies" | "see_appointments" | "add_appointments">("studies")

  const { patients } = useSelector(patientsSelector).ui;  

  const patient = useMemo(() => {
    return patients?.find((p) => p.id === patientId) ?? null;
  }, [patients, patientId]);

  useEffect(() => {
    if (!patientId) return;
    dispatch(getStudies(patientId));
  }, [dispatch, patientId]);   

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
        <div className="rounded-[2rem] justify-center flex border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          {/* Tabs */}
          <div className="inline-flex items-center justify-center rounded-lg bg-muted p-1 space-x-2">
            <button
              onClick={() => setActiveTab("studies")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition hover:bg-[#26a69a] hover:text-white transition-all
                ${
                  activeTab === "studies"
                    ? "bg-[#26a69a] shadow-sm text-foreground text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Ver estudios
            </button>
            <button
              onClick={() => setActiveTab("see_appointments")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition hover:bg-[#26a69a] hover:text-white transition-all
                ${
                  activeTab === "see_appointments"
                    ? "bg-[#26a69a] shadow-sm text-foreground text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Ver consultas
            </button>

            <button
              onClick={() => setActiveTab("add_appointments")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition hover:bg-[#26a69a] hover:text-white transition-all
                ${
                  activeTab === "add_appointments"
                    ? "bg-[#26a69a] shadow-sm text-foreground text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Agregar consultas
            </button>
          </div>
        </div>
        
        {/* ── Studies ──────────────────────────────────────────────── */}
        {activeTab === 'studies' && <StudiesTab />}
        {activeTab === 'see_appointments' && <AppointmentsTable />}
      </div>
    </>
  );
}
