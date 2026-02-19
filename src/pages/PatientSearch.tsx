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
      <div className="max-w-6xl mx-auto">
        {/* Search Form */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, ID..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative min-w-[200px]">
              <select
                className="w-full appearance-none border border-gray-300 rounded-md px-4 py-2 pr-8 bg-white"
                value={selectedStudyType}
                onChange={(e) => setSelectedStudyType(e.target.value)}
              >
                {studyTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
            
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition duration-200">
              Buscar
            </button>
          </div>

          <button
            className="mt-4 flex items-center text-green-600 font-medium text-sm"
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
            <div className="mt-4 p-4 border border-gray-200 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Médico</label>
                <select className="w-full border border-gray-300 rounded-md px-4 py-2">
                  <option>Todos los médicos</option>
                  <option>Dr. García</option>
                  <option>Dra. Rodríguez</option>
                  <option>Dr. Martínez</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Centro médico</label>
                <select className="w-full border border-gray-300 rounded-md px-4 py-2">
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#009975]">Resultados</h2>
              <span className="text-gray-500 font-medium">
                {filteredPatients.length} resultados encontrados
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Último estudio</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">ID: {patient.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{patient.lastStudy}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        // onClick={() => navigate(`/pacientes/${patient.id}`)}
                        onClick={() => navigate(`/search-patient`)}
                        className="text-green-600 hover:text-green-900 hover:bg-green-50 border border-green-600 rounded-md px-4 py-1 text-sm font-medium transition duration-150"
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
              <p className="text-gray-500">No se encontraron pacientes con los criterios de búsqueda.</p>
            </div>
          )}
          
          {filteredPatients.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <nav className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredPatients.length}</span> de <span className="font-medium">{patients.length}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Anterior</span>
                        &larr;
                      </button>
                      <button className="bg-green-50 border-green-500 text-green-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        1
                      </button>
                      <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        2
                      </button>
                      <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        3
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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