import PageMeta from "../../components/common/PageMeta";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getDayConsultations } from "../../redux/doctors/doctors.action";
import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { doctorsSelector } from "../../redux/doctors/doctors.selector";


export default function Home() {
  const doctor = useSelector((state: RootState) => state.auth.doctor);
  const dispatch = useAppDispatch();
  const { agendaData } = useSelector(doctorsSelector).ui;

  useEffect(() => {
    if (doctor) {
      dispatch(getDayConsultations(doctor.id));
    }
  }, [doctor]);
  const currentDate = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <PageMeta
        title="Inicio | VisuMed"
        description="Panel principal del doctor"
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="relative col-span-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(38,166,154,0.14),_transparent_38%)]" />
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">¡Buen día, {doctor?.firstName}!</h1>
              <p className="text-slate-500 dark:text-slate-400">{currentDate}</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 shadow-xl backdrop-blur">
              <h3 className="mb-2 text-sm text-slate-500">Citas de hoy</h3>
              <p className="text-2xl font-bold text-[#26a69a]">
                {agendaData?.consultationsToday}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 shadow-xl backdrop-blur">
              <h3 className="mb-2 text-sm text-slate-500">Próxima cita</h3>
              <p className="text-2xl font-bold text-[#26a69a]">{agendaData?.nextConsultationTime}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 shadow-xl backdrop-blur">
              <h3 className="mb-2 text-sm text-slate-500">Tiempo disponible</h3>
              <p className="text-2xl font-bold text-[#26a69a]">4h 30m</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Novedades</h2>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <h3 className="font-medium text-[#26a69a]">Actualización del sistema</h3>
                <p className="text-sm text-slate-500">Nueva funcionalidad de recetas electrónicas disponible</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <h3 className="font-medium text-[#26a69a]">Recordatorio</h3>
                <p className="text-sm text-slate-500">Junta mensual de personal este viernes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-6 rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Agenda de Hoy</h2>
            <div className="space-y-4">
              {agendaData?.consultations?.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-slate-500">{item.time}</div>
                  <div
                    className={`flex-1 rounded-2xl p-3 bg-blue-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 xs:max-w-[200px] md:max-w-auto overflow-hidden text-ellipsis whitespace-nowrap`}
                  >
                    {item.patientName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}