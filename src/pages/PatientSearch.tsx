import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import PageMeta from '../components/common/PageMeta';

interface Patient {
  id: string;
  name: string;
  lastStudy: string;
}

const PacientesSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudyType, setSelectedStudyType] = useState('Todos los estudios');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Mock data for demo purposes
  const patients: Patient[] = [
    { id: '28374-A', name: 'María García', lastStudy: 'Radiografía de tórax' },
    { id: '45621-B', name: 'Juan López', lastStudy: 'Tomografía craneal' },
    { id: '12985-C', name: 'Carlos Rodríguez', lastStudy: 'Radiografía de fémur' },
    { id: '78542-D', name: 'Ana Martínez', lastStudy: 'Resonancia lumbar' },
    { id: '36985-E', name: 'Pedro Sánchez', lastStudy: 'Radiografía dental' },
    { id: '45128-F', name: 'Laura González', lastStudy: 'Ecografía abdominal' },
    { id: '23651-G', name: 'Roberto Díaz', lastStudy: 'Tomografía de tórax' },
    { id: '89765-H', name: 'Carmen Jiménez', lastStudy: 'Resonancia cerebral' },
    { id: '56234-I', name: 'Javier Moreno', lastStudy: 'Radiografía de columna' },
    { id: '67543-J', name: 'Sofía Gutiérrez', lastStudy: 'Ecografía tiroidea' },
  ];

  const studyTypes = ['Todos los estudios', 'Radiografía', 'Tomografía', 'Resonancia', 'Ecografía'];

  // Filter patients based on search term and filters
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStudyType = selectedStudyType === 'Todos los estudios' || 
                            patient.lastStudy.toLowerCase().includes(selectedStudyType.toLowerCase());
    
    return matchesSearch && matchesStudyType;
  });

  return (
    <>
      <PageMeta
        title="VisuMed | Buscar pacientes"
        description="Buscador de pacientes para médicos"
      />
      <PageBreadcrumb pageTitle="Buscador de Pacientes" />
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Search Form */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, ID..."
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
                {studyTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown size={18} className="text-slate-400" />
              </div>
            </div>
            
            <button className="rounded-full bg-[#26a69a] px-6 py-3 font-medium text-white transition hover:bg-[#1f8c81]">
              Buscar
            </button>
          </div>

          <button
            className="mt-4 flex items-center text-sm font-medium text-[#26a69a]"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            Mostrar filtros avanzados
            {showAdvancedFilters ? (
              <ChevronUp size={16} className="ml-1" />
            ) : (
              <ChevronDown size={16} className="ml-1" />
            )}
          </button>
          
          {showAdvancedFilters && (
            <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-400">Médico</label>
                <select className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white">
                  <option>Todos los médicos</option>
                  <option>Dr. García</option>
                  <option>Dra. Rodríguez</option>
                  <option>Dr. Martínez</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-400">Centro médico</label>
                <select className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white">
                  <option>Todos los centros</option>
                  <option>Centro A</option>
                  <option>Centro B</option>
                  <option>Centro C</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Results Table */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/85 shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
          <div className="border-b border-slate-200 p-6 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#26a69a]">Resultados</h2>
              <span className="font-medium text-slate-500">
                {filteredPatients.length} resultados encontrados
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/40">
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-slate-500">Paciente</th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-slate-500">Último estudio</th>
                  <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider text-slate-500">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    className="transition duration-150 hover:bg-slate-50 dark:hover:bg-slate-950/40"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{patient.name}</div>
                      <div className="text-sm text-slate-500">ID: {patient.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{patient.lastStudy}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        // onClick={() => navigate(`/pacientes/${patient.id}`)}
                        onClick={() => navigate(`/search-patient`)}
                        className="rounded-full border border-[#26a69a] px-4 py-2 text-sm font-medium text-[#26a69a] transition duration-150 hover:bg-[#26a69a] hover:text-white"
                      >
                        Ver detalles →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">No se encontraron pacientes con los criterios de búsqueda.</p>
            </div>
          )}
          
          {filteredPatients.length > 0 && (
            <div className="border-t border-slate-200 px-6 py-4 dark:border-slate-800">
              <nav className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
                    Anterior
                  </button>
                  <button className="ml-3 relative inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-400">
                      Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredPatients.length}</span> de <span className="font-medium">{patients.length}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex -space-x-px overflow-hidden rounded-full border border-slate-200 shadow-sm dark:border-slate-700" aria-label="Pagination">
                      <button className="relative inline-flex items-center rounded-l-full border border-slate-200 bg-white px-2 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/40">
                        <span className="sr-only">Anterior</span>
                        &larr;
                      </button>
                      <button className="relative inline-flex items-center border border-[#26a69a] bg-[#26a69a]/10 px-4 py-2 text-sm font-medium text-[#26a69a]">
                        1
                      </button>
                      <button className="relative inline-flex items-center border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/40">
                        2
                      </button>
                      <button className="relative inline-flex items-center border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/40">
                        3
                      </button>
                      <button className="relative inline-flex items-center rounded-r-full border border-slate-200 bg-white px-2 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/40">
                        <span className="sr-only">Siguiente</span>
                        &rarr;
                      </button>
                    </nav>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PacientesSearch;