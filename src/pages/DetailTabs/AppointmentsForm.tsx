import React, { useState } from 'react'
import { useAppDispatch } from '../../redux/hooks';
import { createConsultation } from '../../redux/consultations/consultations.action';
import { selectDoctor } from '../../redux/auth/auth.slice';
import { useSelector } from 'react-redux';

export const AppointmentsForm = () => {
    const [activeTab, setActiveTab] = useState<"see_appointment"|"add_appointment"|"patient_info">("patient_info");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const doctor = useSelector(selectDoctor);
    const dispatch = useAppDispatch()

    const handleSubmitAppointment = () => {
        const scheduledAt = new Date(`${appointmentDate}T${appointmentTime}`).toISOString();
        dispatch(createConsultation({
            patientId: patient.id,
            doctorId: doctor ? doctor?.id : "",
            scheduledAt,
            status: "confirmed",
        }));
    }

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
