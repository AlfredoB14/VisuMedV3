import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import TomographyView from "./tomographyView";
import { Patient } from "../../../redux/patients/types/Patients.interface";
import { useAppDispatch } from "../../../redux/hooks";
import { createConsultation, getConsultations } from "../../../redux/consultations/consultations.action";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Consultation } from "../../../redux/consultations/types/Consultations.interface";


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
    const doctor = useSelector((state: RootState) => state.auth.doctor);
    const consultations = useSelector((state: RootState) => state.consultation.ui.consultations)
    const [selectedTomography, setSelectedTomography] = useState<Tomography | null>(null);
    const [activeTab, setActiveTab] = useState<"see_appointment"|"add_appointment"|"patient_info">("patient_info");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getConsultations({ patientId: patient?.id, doctorId: doctor?.id ? doctor?.id : "", status: "confirmed"} ))
    }, [])

    const handleSubmitAppointment = () => {
        const scheduledAt = new Date(`${appointmentDate}T${appointmentTime}`).toISOString();
        dispatch(createConsultation({
            patientId: patient.id,
            doctorId: doctor ? doctor?.id : "",
            scheduledAt,
            status: "confirmed",
        }));
    }

    if (selectedTomography) {
        return <TomographyView tomography={selectedTomography} onBack={() => setSelectedTomography(null)} />;
    }

    const PatientInfo = () => {
        return (
            <div>
                <div className="rounded-3xl border border-[#26a69a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-[#26a69a]/30 dark:bg-slate-900/70 lg:p-6">
                    <div className="mb-8 flex items-center justify-between w-full">
                        <div className="flex flex-row">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#26a69a] text-xl text-white shadow-sm">
                                {patient.firstName.charAt(0)}
                            </div>
                            <div className="ml-6">
                                <h2 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">{patient.firstName} {patient.lastName}</h2>
                                <p className="text-slate-500 dark:text-slate-400">{patient.birthDate}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-[50%] justify-end">
                            <button className=" max-w-[10rem] w-full rounded-full bg-[#26a69a] px-4 py-3 font-medium text-white transition hover:bg-[#1f8c81]" onClick={() => setActiveTab("see_appointment")}>
                                Ver consultas
                            </button>
                            <button className="max-w-[10rem] w-full rounded-full bg-[#26a69a] px-4 py-3 font-medium text-white transition hover:bg-[#1f8c81]" onClick={() => setActiveTab("add_appointment")}>
                                Registrar consulta
                            </button>
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
        )
    }

    const AppointmentTable = () => {
        return(
            <div>
                <div className="rounded-3xl border border-[#26a69a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-[#26a69a]/30 dark:bg-slate-900/70 lg:p-6">
                    <div className="mb-8 flex items-center justify-between w-full">
                        <div className="flex flex-row">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#26a69a] text-xl text-white shadow-sm">
                                {patient.firstName.charAt(0)}
                            </div>
                            <div className="ml-6">
                                <h2 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">{patient.firstName} {patient.lastName}</h2>
                                <p className="text-slate-500 dark:text-slate-400">{patient.birthDate}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-[50%] justify-end">
                            <button className=" max-w-[10rem] w-full rounded-full bg-[#26a69a] px-4 py-3 font-medium text-white transition hover:bg-[#1f8c81]" onClick={() => setActiveTab("see_appointment")}>
                                Ver consultas
                            </button>
                            <button className="max-w-[10rem] w-full rounded-full bg-[#26a69a] px-4 py-3 font-medium text-white transition hover:bg-[#1f8c81]" onClick={() => setActiveTab("add_appointment")}>
                                Registrar consulta
                            </button>
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
                        <div className="overflow-hidden rounded-2xl border border-[#26a69a]/15 bg-white/80 dark:border-[#26a69a]/20 dark:bg-slate-900/40">
                            <table className="min-w-full divide-y divide-[#26a69a]/15 border-collapse dark:divide-[#26a69a]/20">
                                <thead className="bg-[#26a69a]/10 dark:bg-[#26a69a]/15">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                        Fecha de consulta
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                        Estado:
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                        Fecha de creación
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-[#26a69a]/10 bg-white/90 dark:divide-[#26a69a]/15 dark:bg-slate-900/40">
                                    {consultations?.map((item: Consultation) => (
                                        <tr
                                        key={item.id}
                                        className="transition-colors duration-150 ease-in-out hover:bg-[#26a69a]/8 dark:hover:bg-[#26a69a]/10"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                               {new Date(item.scheduledAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {item.status}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {item.createdAt}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                    </div>
                </div>
            </div>
        )
    }

    const RegisterAppointment = () => {
        return (
            <div>
                <div className="rounded-3xl border border-[#26a69a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-[#26a69a]/30 dark:bg-slate-900/70 lg:p-6">
                    <div className="mb-8 flex items-center justify-between w-full">
                        <div className="flex flex-row">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#26a69a] text-xl text-white shadow-sm">
                                {patient.firstName.charAt(0)}
                            </div>
                            <div className="ml-6">
                                <h2 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">{patient.firstName} {patient.lastName}</h2>
                                <p className="text-slate-500 dark:text-slate-400">{patient.birthDate}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-[50%] justify-end">
                            <button className=" max-w-[10rem] w-full rounded-full bg-[#26a69a] px-4 py-3 font-medium text-white transition hover:bg-[#1f8c81]" onClick={() => setActiveTab("see_appointment")}>
                                Ver consultas
                            </button>
                            <button className="max-w-[10rem] w-full rounded-full bg-[#26a69a] px-4 py-3 font-medium text-white transition hover:bg-[#1f8c81]" onClick={() => setActiveTab("add_appointment")}>
                                Registrar consulta
                            </button>
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
                        <h3 className="font-medium text-lg mb-4">Nueva consulta</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Fecha de la consulta
                                </label>
                                <input
                                    type="date"
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    className="w-full rounded-xl border border-[#26a69a]/30 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-[#26a69a]/30 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-[#26a69a]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Hora de la consulta
                                </label>
                                <input
                                    type="time"
                                    value={appointmentTime}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                    className="w-full rounded-xl border border-[#26a69a]/30 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-[#26a69a]/30 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-[#26a69a]"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button className="rounded-full bg-[#26a69a] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f8c81]" onClick={() => handleSubmitAppointment()}>
                                Registrar consulta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
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
            {activeTab === 'patient_info' && (
                <PatientInfo />
            )}
            {activeTab === 'see_appointment' && (
                <AppointmentTable />
            )}
            {activeTab === 'add_appointment' && (
                <RegisterAppointment />
            )}
        </div>
    );
}
