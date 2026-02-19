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
        {/* Welcome Section */}
        <div className="col-span-12">
          <div className="p-8 bg-gradient-to-r from-[#009975] to-[#007960] rounded-xl text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">¡Buen día, {doctorName}!</h1>
                <p className="text-white/80">{currentDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-8">
          {/* Today's Overview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-6 bg-white rounded-xl">
              <h3 className="text-sm text-gray-600 mb-2">Citas de hoy</h3>
              <p className="text-2xl font-bold text-[#009975]">
                {todaySchedule.filter(item => item.type === 'appointment').length}
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl">
              <h3 className="text-sm text-gray-600 mb-2">Próxima cita</h3>
              <p className="text-2xl font-bold text-[#009975]">10:00</p>
            </div>
            <div className="p-6 bg-white rounded-xl">
              <h3 className="text-sm text-gray-600 mb-2">Tiempo disponible</h3>
              <p className="text-2xl font-bold text-[#009975]">4h 30m</p>
            </div>
          </div>

          {/* News or Announcements */}
          <div className="p-6 bg-white rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Novedades</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800">Actualización del sistema</h3>
                <p className="text-sm text-blue-600">Nueva funcionalidad de recetas electrónicas disponible</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800">Recordatorio</h3>
                <p className="text-sm text-green-600">Junta mensual de personal este viernes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="col-span-12 md:col-span-4">
          <div className="bg-white rounded-xl p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Agenda de Hoy</h2>
            <div className="space-y-4">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-600">{item.time}</div>
                  <div className={`flex-1 p-3 rounded-lg ${
                    item.type === 'meeting' ? 'bg-purple-50 text-purple-700' :
                    item.type === 'break' ? 'bg-gray-50 text-gray-700' :
                    'bg-[#009975]/10 text-[#009975]'
                  }`}>
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