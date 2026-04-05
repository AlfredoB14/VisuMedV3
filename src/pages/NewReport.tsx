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
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {/* Card de información del estudio */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="mb-6 border-b border-slate-200 pb-3 text-2xl font-bold text-[#26a69a] dark:border-slate-800">
            Información del Estudio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Nombre del Estudio</label>
              <input
                type="text"
                name="nombreEstudio"
                value={formData.nombreEstudio}
                onChange={handleChange}
                placeholder="Ej: Radiografía de tórax"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Técnica del Estudio</label>
              <input
                type="text"
                name="tecnicaEstudio"
                value={formData.tecnicaEstudio}
                onChange={handleChange}
                placeholder="Ej: Tomografía multicorte"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Fecha del Estudio</label>
              <input
                type="date"
                name="fechaEstudio"
                value={formData.fechaEstudio}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Card de información del paciente */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="mb-6 border-b border-slate-200 pb-3 text-2xl font-bold text-[#26a69a] dark:border-slate-800">
            Información del Paciente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Nombre del Paciente</label>
              <input
                type="text"
                name="paciente.nombre"
                value={formData.paciente.nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Fecha de Nacimiento</label>
              <input
                type="date"
                name="paciente.fechaNacimiento"
                value={formData.paciente.fechaNacimiento}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Sexo</label>
              <select
                name="paciente.sexo"
                value={formData.paciente.sexo}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Edad</label>
              <input
                type="number"
                name="paciente.edad"
                value={formData.paciente.edad}
                onChange={handleChange}
                placeholder="Edad en años"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Card de detalles del estudio */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="mb-6 border-b border-slate-200 pb-3 text-2xl font-bold text-[#26a69a] dark:border-slate-800">
            Detalles del Estudio
          </h2>
          
          <div className="mb-6">
            <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Indicación del Estudio</label>
            <textarea
              name="indicacionEstudio"
              value={formData.indicacionEstudio}
              onChange={handleChange}
              rows={2}
              placeholder="Motivo por el que se realiza el estudio"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Hallazgos</label>
            <textarea
              name="hallazgos"
              value={formData.hallazgos}
              onChange={handleChange}
              rows={4}
              placeholder="Descripción detallada de los hallazgos encontrados"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="mb-2 block font-medium text-slate-700 dark:text-slate-400">Estudios Previos</label>
            <textarea
              name="estudiosPrevios"
              value={formData.estudiosPrevios}
              onChange={handleChange}
              rows={2}
              placeholder="Información de estudios anteriores relacionados"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
            ></textarea>
          </div>
        </div>
        
        {/* Card de conclusiones y sugerencias */}
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="mb-6 border-b border-slate-200 pb-3 text-2xl font-bold text-[#26a69a] dark:border-slate-800">
            Conclusiones y Sugerencias
          </h2>
          
          <div className="mb-8">
            <label className="mb-3 block font-medium text-slate-700 dark:text-slate-400">Conclusiones</label>
            <div className="flex mb-3">
              <input
                type="text"
                value={nuevaConclusion}
                onChange={(e) => setNuevaConclusion(e.target.value)}
                className="flex-grow rounded-l-full border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                placeholder="Agregar nueva conclusión"
              />
              <button 
                onClick={agregarConclusion}
                className="rounded-r-full bg-[#26a69a] px-6 py-3 font-medium text-white transition-all hover:bg-[#1f8c81]"
              >
                Agregar
              </button>
            </div>
            {formData.conclusiones.length > 0 ? (
              <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {formData.conclusiones.map((conclusion, index) => (
                  <li key={index} className="flex items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-950/40">
                    <span className="flex-grow text-slate-700 dark:text-slate-300">{conclusion}</span>
                    <button 
                      onClick={() => eliminarConclusion(index)}
                      className="ml-3 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 italic text-slate-500">No hay conclusiones agregadas</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="mb-3 block font-medium text-slate-700 dark:text-slate-400">Sugerencias</label>
            <div className="flex mb-3">
              <input
                type="text"
                value={nuevaSugerencia}
                onChange={(e) => setNuevaSugerencia(e.target.value)}
                className="flex-grow rounded-l-full border border-slate-200 bg-slate-50 p-3 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                placeholder="Agregar nueva sugerencia"
              />
              <button 
                onClick={agregarSugerencia}
                className="rounded-r-full bg-[#26a69a] px-6 py-3 font-medium text-white transition-all hover:bg-[#1f8c81]"
              >
                Agregar
              </button>
            </div>
            {formData.sugerencias.length > 0 ? (
              <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {formData.sugerencias.map((sugerencia, index) => (
                  <li key={index} className="flex items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-950/40">
                    <span className="flex-grow text-slate-700 dark:text-slate-300">{sugerencia}</span>
                    <button 
                      onClick={() => eliminarSugerencia(index)}
                      className="ml-3 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 italic text-slate-500">No hay sugerencias agregadas</p>
            )}
          </div>
        </div>
        
        {/* Botón de acción */}
        <div className="flex justify-end mt-8">
          <button 
            onClick={generarReporte}
            className="rounded-full bg-[#26a69a] px-5 py-3 text-lg font-semibold text-white shadow-md transition-all hover:bg-[#1f8c81] hover:shadow-lg"
          >
            Generar Reporte
          </button>
        </div>
      </div>
    </>
  );
}