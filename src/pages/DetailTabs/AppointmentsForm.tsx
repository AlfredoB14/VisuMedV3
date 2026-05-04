import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector} from '../../redux/hooks';
import { createConsultation } from '../../redux/consultations/consultations.action';
import { selectDoctor } from '../../redux/auth/auth.slice';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { consultationSelector } from '../../redux/consultations/consultations.selector';

export const AppointmentsForm = ({ patientId } : {patientId: string}) => {
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const doctor = useSelector(selectDoctor);
    const { error: errorConsultation, loading } = useAppSelector(consultationSelector).ui;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!submitted) return;
      
        if (!loading && !errorConsultation) {
          toast.success("Consulta creada con éxito.");
          setAppointmentDate("");
          setAppointmentTime("");
          setSubmitted(false);
        }
      }, [loading, errorConsultation, submitted]);

    const handleSubmitAppointment = () => {
        setSubmitted(true);

        const scheduledAt = new Date(`${appointmentDate}T${appointmentTime}`).toISOString();
        dispatch(createConsultation({
            patientId: patientId,
            doctorId: doctor ? doctor?.id : "",
            scheduledAt,
            status: "confirmed",
        }));
    }

    return (
    <div>
        <div className="rounded-3xl border border-[#26a69a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-[#26a69a]/30 dark:bg-slate-900/70 lg:p-6">
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
