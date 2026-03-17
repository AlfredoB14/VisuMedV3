import React from 'react';
import { useTheme } from '../context/ThemeContext';
import PageMeta from '../components/common/PageMeta';

const VisuMedLanding: React.FC = () => {
  const { toggleTheme } = useTheme();

  return (
    <>
      <PageMeta
        title="VisuMed - Software de Tomografía y Gestión"
        description="Software médico de última generación para tomografías y gestión de pacientes con IA explicativa."
      />

      <div className="bg-white dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 antialiased font-sans scroll-smooth">

        {/* ── Header ── */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#26a69a] rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined">biotech</span>
              </div>
             <span className="text-[#26a69a]">VisuMed</span>
            </div>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              <a className="font-medium hover:text-[#26a69a] transition-colors" href="#funcionalidades">Funcionalidades</a>
              <a className="font-medium hover:text-[#26a69a] transition-colors" href="#ia">IA Explicativa</a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={toggleTheme}
                aria-label="Cambiar tema"
              >
                <span className="material-symbols-outlined dark:hidden">dark_mode</span>
                <span className="material-symbols-outlined hidden dark:block">light_mode</span>
              </button>
              <a
                className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all cursor-pointer"
                href="home"
              >
                Solicitar Demo
              </a>
            </div>
          </nav>
        </header>

        <main className="pt-20">

          {/* ── Hero Section ── */}
          <section className="relative overflow-hidden pt-12 lg:pt-20 pb-20 medical-bg-pattern">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">

              {/* Left Copy */}
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-block bg-[#26a69a]/10 text-[#26a69a] px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                  Software Médico de Última Generación
                </span>
                <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6">
                  Software de Tomografía Inteligente: <br />
                  <span className="text-[#26a69a]">Humanizando el Diagnóstico</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0">
                  Optimiza tu flujo clínico con tomografías avanzadas, gestión integral de pacientes y herramientas de análisis en la nube.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  

                  
                </div>
              </div>

              {/* Right Image */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-[#26a69a]/10 rounded-full blur-3xl -z-10"></div>
                <div className="relative">
                  <img
                    alt="Paciente viendo tomografía 3D en tablet"
                    className="w-full h-auto rounded-3xl shadow-2xl z-10 border-4 border-slate-900"
                    src="https://gdm-catalog-fmapi-prod.imgix.net/ProductScreenshot/3ad0b666-a0ed-4b86-8e81-17b2e36f9bb7.jpeg?auto=format&q=50"
                  />

                  {/* Badge: Renderizado 3D */}
                  

                  {/* Badge: Análisis IA */}
                  
                </div>
              </div>
            </div>
          </section>

          {/* ── Hospitales ── */}
          
          {/* ── Funcionalidades ── */}
          <section className="py-24" id="funcionalidades">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white mb-6">
                  Soluciones <span className="text-[#26a69a]">Integrales</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Herramientas diseñadas para elevar la calidad diagnóstica y la experiencia del paciente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Card 1 */}
                <div className="group p-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-[#26a69a]/10 rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#26a69a] text-3xl">folder_shared</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Gestión Integral</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Control total de expedientes clínicos y agenda de citas en una plataforma unificada.
                  </p>
                </div>

                {/* Card 2 — Destacada */}
                <div className="group p-8 bg-[#26a69a] text-white rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-white text-3xl">view_in_ar</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Visor de Tomografías</h3>
                  <p className="text-white/80">
                    Acceso directo para que el paciente visualice sus estudios en alta definición desde cualquier lugar.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="group p-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-[#26a69a]/10 rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#26a69a] text-3xl">chat_bubble</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Intérprete IA</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Chatbot inteligente que traduce términos médicos complejos a lenguaje cotidiano y comprensible.
                  </p>
                </div>

                {/* Card 4 */}
                <div className="group p-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-[#26a69a]/10 rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#26a69a] text-3xl">cloud_done</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Almacenamiento Seguro</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Nube encriptada de grado médico para proteger datos sensibles y cumplir con normativas.
                  </p>
                </div>

                {/* Card 5 */}
                <div className="group p-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-[#26a69a]/10 rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#26a69a] text-3xl">description</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Reportes Automáticos</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Generación de informes rápidos y precisos asistidos por IA para optimizar el tiempo del radiólogo.
                  </p>
                </div>

                {/* Card 6 */}
                <div className="group p-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-[#26a69a]/10 rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#26a69a] text-3xl">devices</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Acceso Multidispositivo</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Consulta estudios y gestiona pacientes desde PC, tablet o teléfono móvil sin complicaciones.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* ── IA Section ── */}
          <section className="py-24 bg-[#26a69a] overflow-hidden" id="ia">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-16">

                {/* Left Copy */}
                <div className="flex-1 text-white">
                  <h2 className="text-4xl lg:text-5xl font-display font-extrabold mb-8">
                    Tu Salud, Explicada por IA
                  </h2>
                  <p className="text-white/80 text-lg mb-8 leading-relaxed">
                    Eliminamos la barrera de la terminología médica compleja. Nuestro asistente inteligente analiza el reporte técnico y lo explica en palabras que cualquier persona puede entender.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-white">check_circle</span>
                      <span>Traducción instantánea de tecnicismos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-white">check_circle</span>
                      <span>Disponible 24/7 para dudas del paciente</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-white">check_circle</span>
                      <span>Mejora la adherencia al tratamiento</span>
                    </div>
                  </div>
                </div>

                {/* Right Chat UI */}
                <div className="flex-1 w-full">
                  <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-4 border border-white/20 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* Reporte técnico */}
                      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-inner">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="material-symbols-outlined text-slate-400 text-sm">assignment</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Reporte Radiológico
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono leading-relaxed">
                          "Se observa opacidad en vidrio despulido bilateral con predominio periférico. El parénquima pulmonar presenta trazos de fibrosis incipiente..."
                        </p>
                      </div>

                      {/* Chatbot respuesta */}
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 shadow-xl border-2 border-[#26a69a]">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="material-symbols-outlined text-[#26a69a]">smart_toy</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#26a69a]">
                            VisuMed Chatbot
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 italic">
                          "En palabras simples: Tu pulmón está sano, solo hay una pequeña inflamación que estamos vigilando..."
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Stats ── */}
          

          {/* ── Testimonios ── */}
        

          {/* ── CTA ── */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-900 dark:bg-[#26a69a] rounded-[3rem] p-8 lg:p-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#26a69a]/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                  <div className="text-center lg:text-left">
                    <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-white mb-6">
                      Empodera a tus pacientes con VisuMed
                    </h2>
                    <p className="text-white/70 max-w-lg text-lg">
                      Agenda tu demo hoy mismo y descubre cómo modernizar tu flujo de trabajo radiológico.
                    </p>
                  </div>
                  <button className="bg-white text-slate-900 px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 hover:shadow-2xl transition-all whitespace-nowrap">
                    Agenda tu Demo <span className="material-symbols-outlined">event_available</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* ── Footer ── */}
        <footer className="bg-slate-50 dark:bg-slate-900 pt-20 pb-10 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

              {/* Branding */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#26a69a] rounded-lg flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">biotech</span>
                  </div>
                     <span className="text-[#26a69a]">VisuMed</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  Software de análisis de tomografía de próxima generación impulsado por inteligencia artificial para profesionales de la salud.
                </p>
                <div className="flex gap-4">
                  <a className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#26a69a] hover:text-white transition-all" href="#">
                    <span className="material-symbols-outlined">public</span>
                  </a>
                  <a className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#26a69a] hover:text-white transition-all" href="#">
                    <span className="material-symbols-outlined">terminal</span>
                  </a>
                  <a className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#26a69a] hover:text-white transition-all" href="#">
                    <span className="material-symbols-outlined">description</span>
                  </a>
                </div>
              </div>

              {/* Recursos */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-6">Recursos</h4>
                <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                  <li><a className="hover:text-[#26a69a] transition-colors" href="#">Documentación API</a></li>
                  <li><a className="hover:text-[#26a69a] transition-colors" href="#">Manual de Usuario</a></li>
                  <li><a className="hover:text-[#26a69a] transition-colors" href="#">Portal de Desarrolladores</a></li>
                  <li><a className="hover:text-[#26a69a] transition-colors" href="#">Comunidad</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-6">Legal</h4>
                <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                  <li><a className="hover:text-[#26a69a] transition-colors" href="#">Privacidad</a></li>
                  <li><a className="hover:text-[#26a69a] transition-colors" href="#">Términos de Uso</a></li>
                  <li><a className="hover:text-[#26a69a] transition-colors" href="#">Seguridad de Datos</a></li>
                  <li><a className="hover:text-[#26a69a] transition-colors" href="#">Cumplimiento Médico</a></li>
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-6">Contacto</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[#26a69a]">email</span>
                    <span>contacto@visumed.com</span>
                  </li>
                 
                  
                </ul>
              </div>

            </div>

        
          </div>
        </footer>

      </div>
    </>
  );
};

export default VisuMedLanding;