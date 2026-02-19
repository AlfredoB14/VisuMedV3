import React from 'react';
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";

const VisuMedLanding: React.FC = () => {
	const navigate = useNavigate();

  return (
		<>
			<PageMeta
				title="VisuMed | LandingPage"
				description="VisuMed Landing Page - Plataforma médica avanzada para la visualización y manipulación de estudios radiológicos."
			/>
			<div className="min-h-screen bg-[#f8fae1]">
				{/* Header */}
				<header className="bg-[#009975] text-white shadow-md">
					<div className="container mx-auto px-5 py-5">
						<nav className="flex justify-between items-center">
							<div className="flex items-center text-2xl font-bold">
								<img 
									width={200}
									src="/images/logo/VisuMedLogo.png" 
									alt="VisuMed Logo"  
									className="drop-shadow-lg contrast-200"	
								/>
							</div>
							<ul className="hidden md:flex items-center space-x-8">
								<li><a href="#" className="hover:opacity-80 transition-opacity font-medium">Características</a></li>
								<li><a href="#" className="hover:opacity-80 transition-opacity font-medium">Planes</a></li>
								<li><a href="#" className="hover:opacity-80 transition-opacity font-medium">Nosotros</a></li>
								<li>
									<button 
										onClick={() => navigate("/signin")}
										className="bg-[#e98232] text-white px-5 py-2 rounded font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md"
									>
										Iniciar Sesión
									</button>
								</li>
							</ul>
						</nav>
					</div>
				</header>

				{/* Hero Section */}
				<section className="py-24 bg-[#f8fae1] text-center relative overflow-hidden">
					<div 
						className="absolute bottom-[-50px] left-[-100px] w-72 h-72 bg-[#e98232] rounded-full z-0"
						aria-hidden="true"
					/>
					<div 
						className="absolute bottom-[-150px] right-[-100px] w-96 h-72 bg-[#b4e082] rounded-full z-0"
						aria-hidden="true"
					/>
					
					<div className="container mx-auto px-5 relative z-10">
						<h1 className="text-4xl md:text-5xl font-bold mb-5 text-[#333333]">
							Visualiza y manipula radiografías con precisión y facilidad
						</h1>
						<p className="text-lg max-w-3xl mx-auto mb-10 text-[#333333]">
							VisuMed es la plataforma web avanzada para profesionales médicos que necesitan analizar,
							manipular y compartir estudios radiológicos con herramientas intuitivas y potentes.
						</p>
						<a 
							href="#" 
							className="inline-block bg-[#e98232] text-white px-5 py-3 rounded font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md"
						>
							Comenzar ahora
						</a>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-20 bg-white">
					<div className="container mx-auto px-5">
						<h2 className="text-4xl text-center font-bold text-[#009975] mb-16">
							Características Principales
						</h2>
						
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{/* Feature 1 */}
							<div className="bg-[#f8fae1] rounded-lg shadow-md p-8 text-center transition-all hover:-translate-y-2">
								<div className="bg-[#009975] w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-5">
									<svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
										<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
									</svg>
								</div>
								<h3 className="text-xl font-bold mb-3 text-[#009975]">Visualización HD</h3>
								<p className="text-[#333333]">
									Observa detalles minuciosos con nuestra tecnología de visualización en alta definición,
									optimizada para cada tipo de imagen médica.
								</p>
							</div>
							
							{/* Feature 2 */}
							<div className="bg-[#f8fae1] rounded-lg shadow-md p-8 text-center transition-all hover:-translate-y-2">
								<div className="bg-[#009975] w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-5">
									<svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
										<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
									</svg>
								</div>
								<h3 className="text-xl font-bold mb-3 text-[#009975]">Edición Avanzada</h3>
								<p className="text-[#333333]">
									Ajusta contraste, brillo, aplica filtros y realiza mediciones precisas directamente
									en la interfaz sin necesidad de software adicional.
								</p>
							</div>
							
							{/* Feature 3 */}
							<div className="bg-[#f8fae1] rounded-lg shadow-md p-8 text-center transition-all hover:-translate-y-2">
								<div className="bg-[#009975] w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-5">
									<svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
										<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
									</svg>
								</div>
								<h3 className="text-xl font-bold mb-3 text-[#009975]">Colaboración Segura</h3>
								<p className="text-[#333333]">
									Comparte estudios con colegas de manera segura mediante enlaces protegidos
									o integración con sistemas hospitalarios existentes.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Demo Section */}
				<section className="py-20 bg-[#daf0c6]">
					<div className="container mx-auto px-5">
						<h2 className="text-4xl text-center font-bold text-[#009975] mb-5">
							Experimenta nuestra interfaz
						</h2>
						<p className="text-center max-w-3xl mx-auto mb-10">
							Visualiza y analiza radiografías con nuestra potente interfaz diseñada por y para profesionales médicos
						</p>
						
						<div className="bg-white rounded-lg shadow-lg p-5 max-w-4xl mx-auto mt-10">
							<div className="bg-[#f8fae1] rounded h-96 flex items-center justify-center">
								<img 
									src="/api/placeholder/800/500" 
									alt="Demostración de VisuMed" 
									className="max-w-full max-h-full"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-24 bg-[#009975] text-white text-center">
					<div className="container mx-auto px-5">
						<h2 className="text-4xl font-bold mb-5">
							¿Listo para revolucionar tu análisis radiológico?
						</h2>
						<p className="text-lg max-w-3xl mx-auto mb-10">
							Únete a miles de profesionales médicos que ya optimizaron su flujo de trabajo con VisuMed
						</p>
						<a 
							href="#" 
							className="inline-block bg-[#e98232] text-white px-5 py-3 rounded font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md"
						>
							Comenzar ahora
						</a>
					</div>
				</section>

				{/* Footer - CORREGIDO */}
				<footer className="bg-[#2b2b2b] text-white py-12">
					<div className="container mx-auto px-5">
						<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
							{/* Logo and Description - 3 columns */}
							<div className="md:col-span-3">
								<div className="flex items-center mb-4">
									<img src="/images/logo/VisuMedLogo.png" alt="VisuMed Logo" />
								</div>
								<p className="text-gray-400 text-sm leading-relaxed">
									Plataforma médica especializada en la visualización y manipulación de estudios radiológicos, diseñada 
									para optimizar el diagnóstico y mejorar la atención al paciente.
								</p>
							</div>
							
							{/* Empty space - 3 columns */}
							<div className="hidden md:block md:col-span-3"></div>
							
							{/* Producto section - 2 columns */}
							<div className="md:col-span-2">
								<h4 className="text-[#8bc34a] font-medium mb-4">Producto</h4>
								<ul className="space-y-2">
									<li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Características</a></li>
									<li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Testimonios</a></li>
								</ul>
							</div>
							
							{/* Soporte section - 2 columns */}
							<div className="md:col-span-2">
								<h4 className="text-[#8bc34a] font-medium mb-4">Soporte</h4>
								<ul className="space-y-2">
									<li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Documentación</a></li>
									<li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Preguntas frecuentes</a></li>
									<li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contacto</a></li>
								</ul>
							</div>
							
							{/* Legal section - 2 columns */}
							<div className="md:col-span-2">
								<h4 className="text-[#8bc34a] font-medium mb-4">Legal</h4>
								<ul className="space-y-2">
									<li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Términos de servicio</a></li>
									<li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Política de privacidad</a></li>
									<li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Seguridad</a></li>
								</ul>
							</div>
						</div>
						
						<div className="mt-12 pt-6 border-t border-gray-700">
							<p className="text-gray-500 text-center text-sm">&copy; 2025 VisuMed. Todos los derechos reservados.</p>
						</div>
					</div>
				</footer>
			</div>
		</>
  );
};

export default VisuMedLanding;