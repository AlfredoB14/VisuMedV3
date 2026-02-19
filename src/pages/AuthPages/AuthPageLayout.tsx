import React from "react";
import { Link } from "react-router";

export default function AuthLayout({ children }: {children: React.ReactNode;}) {
  return (
    <div className="min-h-screen bg-[#f8fae1] flex flex-col">
      <div className="flex flex-1 flex-col lg:flex-row">
        {children}
        <div className="items-center hidden w-full lg:w-1/2 bg-[#009975] lg:flex">
          <div className="relative w-full flex items-center justify-center">
            {/* Decorative circles */}
            <div 
              className="absolute bottom-[-50px] left-[-100px] w-72 h-72 bg-[#e98232] rounded-full opacity-20"
              aria-hidden="true"
            />
            <div 
              className="absolute top-[-150px] right-[0px] w-96 h-72 bg-[#b4e082] rounded-full opacity-20"
              aria-hidden="true"
            />
            
            <div className="flex flex-col items-center justify-center max-w-xs relative z-10 py-12">
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                Bienvenido a
              </h2>
                <Link to="/" className="block mb-8">
                  <img
                    width={350}
                    src="/images/logo/VisuMedLogo.png"
                    alt="VisuMed Logo"
                    className="drop-shadow-lg contrast-200"
                  />
                </Link>
              <p className="text-center text-white/80">
                Plataforma médica avanzada para la visualización y manipulación de estudios radiológicos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}