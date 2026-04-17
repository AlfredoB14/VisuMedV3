import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import PageMeta from '../components/common/PageMeta';
import { Patient } from '../redux/patients/types/Patients.interface';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectDoctor } from '../redux/auth/auth.slice';
import { useSelector } from 'react-redux';
import { patientsSelector } from '../redux/patients/patients.selector';
import { getPatients } from '../redux/patients/patients.action';

const STUDY_TYPES = ['Todos los estudios', 'Radiografía', 'Tomografía', 'Resonancia', 'Ecografía'];

const PacientesSearch: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const doctor = useAppSelector(selectDoctor);
  const {
    patients,
    loading: loadingPatients,
    error: patientsError,
  } = useSelector(patientsSelector).ui;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudyType, setSelectedStudyType] = useState('Todos los estudios');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);


  useEffect(() => {
    if (!doctor?.id) return;
    dispatch(getPatients(doctor.id));
  }, [dispatch, doctor?.id]);

  const filteredPatients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
  
    if (!term) return patients ?? [];
  
    return (patients ?? []).filter((patient) => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      const email = patient.email?.toLowerCase() ?? "";
      const phone = patient.phone?.toLowerCase() ?? "";
  
      return (
        fullName.includes(term) ||
        email.includes(term) ||
        phone.includes(term)
      );
    });
  }, [patients, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const lastStudyLabel = (p: Patient) =>
    p.lastConsultationAt
      ? new Date(p.lastConsultationAt).toLocaleDateString('es-MX')
      : '—';

  return (
    <>
      <PageMeta title="VisuMed | Buscar pacientes" description="Buscador de pacientes para médicos" />
      <PageBreadcrumb pageTitle="Buscador de Pacientes" />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Search Form */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, correo…"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative min-w-[200px]">
              <select
                className="w-full appearance-none rounded-full border border-slate-200 bg-slate-50 px-4 py-3 pr-8 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                value={selectedStudyType}
                onChange={(e) => setSelectedStudyType(e.target.value)}
              >
                {STUDY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown size={18} className="text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingPatients}
              className="rounded-full bg-[#26a69a] px-6 py-3 font-medium text-white transition hover:bg-[#1f8c81] disabled:opacity-60"
            >
              {loadingPatients ? 'Buscando…' : 'Buscar'}
            </button>
          </form>

          <button
            className="mt-4 flex items-center text-sm font-medium text-[#26a69a]"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            Mostrar filtros avanzados
            {showAdvancedFilters ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
          </button>

          {showAdvancedFilters && (
            <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-400">Estado del estudio</label>
                <select className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white">
                  <option>Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En proceso</option>
                  <option value="completed">Completado</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {patientsError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20">
            {patientsError}
          </div>
        )}

        {/* Results Table */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/85 shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
          <div className="border-b border-slate-200 p-6 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#26a69a]">Resultados</h2>
              <span className="font-medium text-slate-500">
                {loadingPatients ? 'Cargando…' : `${patients?.length} paciente${patients?.length !== 1 ? 's' : ''} encontrado${patients?.length !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {loadingPatients ? (
            <div className="py-12 text-center text-slate-400">Cargando pacientes…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/40">
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-slate-500">Paciente</th>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-slate-500">Correo</th>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-slate-500">Última consulta</th>
                    <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider text-slate-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="transition duration-150 hover:bg-slate-50 dark:hover:bg-slate-950/40">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-sm text-slate-500">ID: {patient.id.substring(0, 8)}…</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{patient.email || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{lastStudyLabel(patient)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/new-report?patientId=${patient.id}`)}
                          className="mr-2 rounded-full border border-[#26a69a] px-4 py-2 text-sm font-medium text-[#26a69a] transition duration-150 hover:bg-[#26a69a] hover:text-white"
                        >
                          Nuevo reporte
                        </button>
                        <button
                          onClick={() => navigate(`/patient/${patient.id}`)}
                          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition duration-150 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400"
                        >
                          Ver detalles →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {patients?.length === 0 && !loadingPatients && (
                <div className="py-12 text-center">
                  <p className="text-slate-500">No se encontraron pacientes con los criterios de búsqueda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PacientesSearch;
