import { useState, useEffect } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import TomographyView from "./tomographyView";
import { Patient } from "../../../redux/patients/types/Patients.interface";
import { useAppDispatch } from "../../../redux/hooks";
import { getConsultations } from "../../../redux/consultations/consultations.action";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
// import { Consultation } from "../../../redux/consultations/types/Consultations.interface";
import { Study } from "../../../redux/studies/types/Studies.interface";
import { getStudies } from "../../../redux/studies/studies.action";
import { studiesSelector } from "../../../redux/studies/studies.selector";


interface Tomography {
  title: string;
  date: string;
  description: string;
  orthancStudyId?: string;
}

interface PatientHistoryProps {
  patient: Patient;
  onBack: () => void;
}

const MODALITY: Record<string, string> = {
  CT: 'Tomografía', MR: 'Resonancia Magnética', CR: 'Radiografía',
  US: 'Ultrasonido', PT: 'PET', NM: 'Medicina Nuclear',
};

function studyToTomography(s: Study): Tomography {
  return {
    title: `${MODALITY[s.modality] ?? s.modality} — ${s.bodyPart || 'Sin especificar'}`,
    date: s.studyDate ? new Date(s.studyDate).toLocaleDateString('es-MX') : '—',
    description: `Estudio ${s.status} · Modalidad: ${s.modality}`,
    orthancStudyId: s.orthancStudyId,
  };
}

export default function PatientHistory({ patient, onBack }: PatientHistoryProps) {
    const doctor = useSelector((state: RootState) => state.auth.doctor);
    const [selectedTomography, setSelectedTomography] = useState<Tomography | null>(null);
    const {
        studies,
        loading: loadingStudies,
      } = useSelector(studiesSelector).ui;
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!patient.id) return;
      
        dispatch(getStudies(patient.id));
      }, [dispatch, patient.id]);

    useEffect(() => {
        dispatch(getConsultations({ patientId: patient?.id, doctorId: doctor?.id ? doctor?.id : "", status: "confirmed"} ))
    }, [])

    if (selectedTomography) {
        return <TomographyView tomography={selectedTomography} onBack={() => setSelectedTomography(null)} />;
    }

    return (
        <div>
            <button
                onClick={onBack}
                className="mb-4 mr-4 rounded-full border border-[#26a69a]/25 bg-white/90 p-2 text-slate-600 shadow-sm transition hover:bg-[#26a69a]/10 dark:border-[#26a69a]/35 dark:bg-slate-900/70 dark:text-slate-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <PageBreadcrumb pageTitle={`Historial de ${patient.firstName} ${patient.lastName}`} />

            <div className="rounded-3xl border border-[#26a69a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-[#26a69a]/30 dark:bg-slate-900/70 lg:p-6">
                <div className="mb-8 flex items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#26a69a] text-xl text-white shadow-sm">
                        {patient.firstName.charAt(0)}
                    </div>
                    <div className="ml-6">
                        <h2 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">{patient.firstName} {patient.lastName}</h2>
                        <p className="text-slate-500 dark:text-slate-400">{patient.birthDate}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="rounded-2xl border border-[#26a69a]/15 bg-white/80 p-4 shadow-sm dark:border-[#26a69a]/20 dark:bg-slate-900/40">
                        <h3 className="font-medium text-lg mb-2">Información del paciente</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Fecha de alta:</p>
                            <p className="text-sm font-medium">{new Date(patient.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#26a69a]/15 bg-white/80 p-4 shadow-sm dark:border-[#26a69a]/20 dark:bg-slate-900/40">
                        <h3 className="font-medium text-lg mb-2">Resumen médico</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Información resumida del historial médico del paciente aparecerá aquí.
                            Esta es una versión de demostración con información de marcador.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#26a69a]/15 bg-white/80 p-4 shadow-sm dark:border-[#26a69a]/20 dark:bg-slate-900/40">
                    <h3 className="font-medium text-lg mb-4">Sus estudios</h3>

                    {loadingStudies ? (
                        <p className="text-sm text-slate-400">Cargando estudios…</p>
                    ) : studies?.length === 0 ? (
                        <p className="text-sm text-slate-400">Este paciente no tiene estudios registrados.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {studies?.map((study) => {
                                const t = studyToTomography(study);
                                return (
                                    <div
                                        key={study.id}
                                        className="cursor-pointer rounded-xl border border-[#26a69a]/15 p-3 transition duration-200 hover:border-[#26a69a] hover:shadow-md dark:border-[#26a69a]/25"
                                        onClick={() => setSelectedTomography(t)}
                                    >
                                        <img src="/images/Tomography.jpg" alt={t.title} className="mb-2 h-40 w-full rounded-md object-cover" />
                                        <p className="mt-1 text-xs text-slate-400">{t.date}</p>
                                        <h4 className="font-medium text-sm mt-1">{t.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{t.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
