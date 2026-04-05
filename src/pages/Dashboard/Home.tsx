import PageMeta from "../../components/common/PageMeta";

interface DoctorSchedule {
  time: string;
  activity: string;
  type: 'appointment' | 'break' | 'meeting';
}

export default function Home() {
  const doctorName = "Dr. Alejandro Ramírez"; // Vendrá del contexto de autenticación
  const currentDate = new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const todaySchedule: DoctorSchedule[] = [
    { time: '09:00', activity: 'Junta matutina', type: 'meeting' },
    { time: '10:00', activity: 'Consultas', type: 'appointment' },
    { time: '13:00', activity: 'Descanso', type: 'break' },
    { time: '14:00', activity: 'Consultas', type: 'appointment' },
  ];

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
              <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">¡Buen día, {doctorName}!</h1>
              <p className="text-slate-500 dark:text-slate-400">{currentDate}</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <h3 className="mb-2 text-sm text-slate-500">Citas de hoy</h3>
              <p className="text-2xl font-bold text-[#26a69a]">
                {todaySchedule.filter((item) => item.type === "appointment").length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <h3 className="mb-2 text-sm text-slate-500">Próxima cita</h3>
              <p className="text-2xl font-bold text-[#26a69a]">10:00</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
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
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-slate-500">{item.time}</div>
                  <div
                    className={`flex-1 rounded-2xl p-3 ${
                      item.type === "meeting"
                        ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        : item.type === "break"
                          ? "bg-slate-50 text-slate-700 dark:bg-slate-950/40 dark:text-slate-300"
                          : "bg-[#26a69a]/10 text-[#26a69a]"
                    }`}
                  >
                    {item.activity}
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