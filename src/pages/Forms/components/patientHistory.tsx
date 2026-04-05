import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import TomographyView from "./tomographyView";

interface Patient {
  id: number;
  name: string;
  age: number;
  registrationDate: string;
  lastConsultation: string;
  avatar: string;
}

interface Tomography {
  title: string;
  date: string;
  description: string;
}

interface PatientHistoryProps {
  patient: Patient;
  onBack: () => void;
}

export default function PatientHistory({ patient, onBack }: PatientHistoryProps) {
    const [selectedTomography, setSelectedTomography] = useState<Tomography | null>(null);

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
            <PageBreadcrumb pageTitle={`Historial de ${patient.name}`} />

            <div className="rounded-3xl border border-[#26a69a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-[#26a69a]/30 dark:bg-slate-900/70 lg:p-6">
                <div className="mb-8 flex items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#26a69a] text-xl text-white shadow-sm">
                        {patient.avatar}
                    </div>
                    <div className="ml-6">
                        <h2 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">{patient.name}</h2>
                        <p className="text-slate-500 dark:text-slate-400">{patient.age} años</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="rounded-2xl border border-[#26a69a]/15 bg-white/80 p-4 shadow-sm dark:border-[#26a69a]/20 dark:bg-slate-900/40">
                        <h3 className="font-medium text-lg mb-2">Información del paciente</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Fecha de alta:</p>
                            <p className="text-sm font-medium">{patient.registrationDate}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Última consulta:</p>
                            <p className="text-sm font-medium">{patient.lastConsultation}</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            className="cursor-pointer rounded-xl border border-[#26a69a]/15 p-3 transition duration-200 hover:border-[#26a69a] hover:shadow-md dark:border-[#26a69a]/25"
                            onClick={() => setSelectedTomography({ title: "Tomografía Craneal", date: "23/04/2025", description: "Evaluación inicial del cráneo para descartar anomalías." })}
                        >
                            <img src="/images/Tomography.jpg" alt="Tomografía 1" className="mb-2 h-60 w-full rounded-md object-cover" />
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fecha: 23/04/2025</p>
                            <h4 className="font-medium">Tomografía Craneal</h4>
                            <p className="text-sm mt-1">Evaluación inicial del cráneo para descartar anomalías.</p>
                        </div>

                        <div
                            className="cursor-pointer rounded-xl border border-[#26a69a]/15 p-3 transition duration-200 hover:border-[#26a69a] hover:shadow-md dark:border-[#26a69a]/25"
                            onClick={() => setSelectedTomography({ title: "Tomografía de Senos Paranasales", date: "23/04/2025", description: "Revisión detallada de los senos paranasales." })}
                        >
                            <img src="/images/Tomography.jpg" alt="Tomografía 2" className="mb-2 h-60 w-full rounded-md object-cover" />
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fecha: 23/04/2025</p>
                            <h4 className="font-medium">Tomografía de Senos Paranasales</h4>
                            <p className="text-sm mt-1">Revisión detallada de los senos paranasales.</p>
                        </div>

                        <div
                            className="cursor-pointer rounded-xl border border-[#26a69a]/15 p-3 transition duration-200 hover:border-[#26a69a] hover:shadow-md dark:border-[#26a69a]/25"
                            onClick={() => setSelectedTomography({ title: "Tomografía de Tejidos Blandos", date: "23/04/2025", description: "Análisis de tejidos blandos en la región craneal." })}
                        >
                            <img src="/images/Tomography.jpg" alt="Tomografía 3" className="mb-2 h-60 w-full rounded-md object-cover" />
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fecha: 23/04/2025</p>
                            <h4 className="font-medium">Tomografía de Tejidos Blandos</h4>
                            <p className="text-sm mt-1">Análisis de tejidos blandos en la región craneal.</p>
                        </div>

                        <div
                            className="cursor-pointer rounded-xl border border-[#26a69a]/15 p-3 transition duration-200 hover:border-[#26a69a] hover:shadow-md dark:border-[#26a69a]/25"
                            onClick={() => setSelectedTomography({ title: "Tomografía de Diagnóstico General", date: "23/04/2025", description: "Exploración general para diagnóstico inicial." })}
                        >
                            <img src="/images/Tomography.jpg" alt="Tomografía 4" className="mb-2 h-60 w-full rounded-md object-cover" />
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fecha: 23/04/2025</p>
                            <h4 className="font-medium">Tomografía de Diagnóstico General</h4>
                            <p className="text-sm mt-1">Exploración general para diagnóstico inicial.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
