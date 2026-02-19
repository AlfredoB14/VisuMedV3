import React, { useState } from 'react';
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from '../components/common/PageBreadCrumb';

export default function NewReport() {
  const [formData, setFormData] = useState({
    nombreEstudio: '',
    tecnicaEstudio: '',
    fechaEstudio: '',
    paciente: {
      nombre: '',
      fechaNacimiento: '',
      sexo: '',
      edad: ''
    },
    indicacionEstudio: '',
    hallazgos: '',
    estudiosPrevios: '',
    conclusiones: [] as string[],
    sugerencias: [] as string[]
  });

  const [nuevaConclusion, setNuevaConclusion] = useState('');
  const [nuevaSugerencia, setNuevaSugerencia] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'paciente') {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const agregarConclusion = () => {
    if (nuevaConclusion.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        conclusiones: [...prev.conclusiones, nuevaConclusion]
      }));
      setNuevaConclusion('');
    }
  };

  const eliminarConclusion = (index: any) => {
    setFormData(prev => ({
      ...prev,
      conclusiones: prev.conclusiones.filter((_, i) => i !== index)
    }));
  };

  const agregarSugerencia = () => {
    if (nuevaSugerencia.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        sugerencias: [...prev.sugerencias, nuevaSugerencia]
      }));
      setNuevaSugerencia('');
    }
  };

  const eliminarSugerencia = (index: any) => {
    setFormData(prev => ({
      ...prev,
      sugerencias: prev.sugerencias.filter((_, i) => i !== index)
    }));
  };

  const generarReporte = () => {
    // Implementar lógica de generación de reporte
    console.log("Generando reporte con datos:", formData);
  };

  return (
    <>
      <PageMeta
        title="VisuMed | Nuevo Reporte"
        description="Generación de nuevo reporte médico - Plataforma médica avanzada"
      />
      <PageBreadcrumb pageTitle="Registro de Nuevo Reporte" />
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Card de información del estudio */}
        <div className="mb-6 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-[#009975] border-b border-gray-200 pb-3">
            Información del Estudio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nombre del Estudio</label>
              <input
                type="text"
                name="nombreEstudio"
                value={formData.nombreEstudio}
                onChange={handleChange}
                placeholder="Ej: Radiografía de tórax"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#009975] focus:ring-2 focus:ring-[#009975] focus:ring-opacity-20 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Técnica del Estudio</label>
              <input
                type="text"
                name="tecnicaEstudio"
                value={formData.tecnicaEstudio}
                onChange={handleChange}
                placeholder="Ej: Tomografía multicorte"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#009975] focus:ring-2 focus:ring-[#009975] focus:ring-opacity-20 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Fecha del Estudio</label>
              <input
                type="date"
                name="fechaEstudio"
                value={formData.fechaEstudio}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#009975] focus:ring-2 focus:ring-[#009975] focus:ring-opacity-20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card de información del paciente */}
        <div className="mb-6 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-[#009975] border-b border-gray-200 pb-3">
            Información del Paciente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nombre del Paciente</label>
              <input
                type="text"
                name="paciente.nombre"
                value={formData.paciente.nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#009975] focus:ring-2 focus:ring-[#009975] focus:ring-opacity-20 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Fecha de Nacimiento</label>
              <input
                type="date"
                name="paciente.fechaNacimiento"
                value={formData.paciente.fechaNacimiento}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#009975] focus:ring-2 focus:ring-[#009975] focus:ring-opacity-20 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Sexo</label>
              <select
                name="paciente.sexo"
                value={formData.paciente.sexo}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#009975] focus:ring-2 focus:ring-[#009975] focus:ring-opacity-20 outline-none appearance-none"
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Edad</label>
              <input
                type="number"
                name="paciente.edad"
                value={formData.paciente.edad}
                onChange={handleChange}
                placeholder="Edad en años"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#009975] focus:ring-2 focus:ring-[#009975] focus:ring-opacity-20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card de detalles del estudio */}
        <div className="mb-6 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-[#009975] border-b border-gray-200 pb-3">
            Detalles del Estudio
          </h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Indicación del Estudio</label>
            <textarea
              name="indicacionEstudio"
              value={formData.indicacionEstudio}
              onChange={handleChange}
              rows={2}
              placeholder="Motivo por el que se realiza el estudio"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#009975] focus:ring-2 focus:ring-[#009975] focus:ring-opacity-20 outline-none resize-none"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Hallazgos</label>
            <textarea
              name="hallazgos"
              value={formData.hallazgos}
              onChange={handleChange}
              rows={4}
              placeholder="Descripción detallada de los hallazgos encontrados"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#009975] focus:ring-2 focus:ring-[#009975] focus:ring-opacity-20 outline-none resize-none"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Estudios Previos</label>
            <textarea
              name="estudiosPrevios"
              value={formData.estudiosPrevios}
              onChange={handleChange}
              rows={2}
              placeholder="Información de estudios anteriores relacionados"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#009975] focus:ring-2 focus:ring-[#009975] focus:ring-opacity-20 outline-none resize-none"
            ></textarea>
          </div>
        </div>
        
        {/* Card de conclusiones y sugerencias */}
        <div className="mb-6 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-[#009975] border-b border-gray-200 pb-3">
            Conclusiones y Sugerencias
          </h2>
          
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">Conclusiones</label>
            <div className="flex mb-3">
              <input
                type="text"
                value={nuevaConclusion}
                onChange={(e) => setNuevaConclusion(e.target.value)}
                className="flex-grow p-3 bg-gray-50 border border-gray-300 rounded-l-lg focus:border-[#009975] focus:ring-2 focus:ring-[#009975] focus:ring-opacity-20 outline-none"
                placeholder="Agregar nueva conclusión"
              />
              <button 
                onClick={agregarConclusion}
                className="px-6 py-3 bg-[#009975] text-white rounded-r-lg font-medium hover:bg-[#007c5f] transition-all"
              >
                Agregar
              </button>
            </div>
            {formData.conclusiones.length > 0 ? (
              <ul className="mt-3 border border-gray-200 rounded-lg divide-y divide-gray-200">
                {formData.conclusiones.map((conclusion, index) => (
                  <li key={index} className="flex items-center p-3 hover:bg-gray-50">
                    <span className="flex-grow text-gray-700">{conclusion}</span>
                    <button 
                      onClick={() => eliminarConclusion(index)}
                      className="ml-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic mt-3">No hay conclusiones agregadas</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-3">Sugerencias</label>
            <div className="flex mb-3">
              <input
                type="text"
                value={nuevaSugerencia}
                onChange={(e) => setNuevaSugerencia(e.target.value)}
                className="flex-grow p-3 bg-gray-50 border border-gray-300 rounded-l-lg focus:border-[#009975] focus:ring-2 focus:ring-[#009975] focus:ring-opacity-20 outline-none"
                placeholder="Agregar nueva sugerencia"
              />
              <button 
                onClick={agregarSugerencia}
                className="px-6 py-3 bg-[#009975] text-white rounded-r-lg font-medium hover:bg-[#007c5f] transition-all"
              >
                Agregar
              </button>
            </div>
            {formData.sugerencias.length > 0 ? (
              <ul className="mt-3 border border-gray-200 rounded-lg divide-y divide-gray-200">
                {formData.sugerencias.map((sugerencia, index) => (
                  <li key={index} className="flex items-center p-3 hover:bg-gray-50">
                    <span className="flex-grow text-gray-700">{sugerencia}</span>
                    <button 
                      onClick={() => eliminarSugerencia(index)}
                      className="ml-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic mt-3">No hay sugerencias agregadas</p>
            )}
          </div>
        </div>
        
        {/* Botón de acción */}
        <div className="flex justify-end mt-8">
          <button 
            onClick={generarReporte}
            className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-[#e85a28] transition-all shadow-md hover:shadow-lg text-lg"
          >
            Generar Reporte
          </button>
        </div>
      </div>
    </>
  );
}