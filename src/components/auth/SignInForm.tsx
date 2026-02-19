import { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigate("/home");
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-[#009975] transition-colors hover:text-[#e98232]"
        >
          <ChevronLeftIcon className="size-5" />
          Regresa al inicio
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-8">
            <h1 className="mb-3 font-bold text-3xl text-[#009975]">
              Iniciar Sesión
            </h1>
            <p className="text-gray-600">
              ¡Ingresa tus credenciales para acceder a tu cuenta!
            </p>
          </div>
          
          <form className="bg-white p-8 rounded-lg shadow-md">
            <div className="space-y-6">
              <div>
                <Label className="text-[#009975] font-medium">
                  Correo electrónico <span className="text-[#e98232]">*</span>
                </Label>
                <Input 
                  placeholder="correo@ejemplo.com"
                  className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:border-[#009975] focus:ring-1 focus:ring-[#009975]"
                />
              </div>

              <div>
                <Label className="text-[#009975] font-medium">
                  Contraseña <span className="text-[#e98232]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:border-[#009975] focus:ring-1 focus:ring-[#009975]"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link
                  to="/reset-password"
                  className="text-sm text-[#009975] hover:text-[#e98232] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button 
                type="button"
                onClick={handleLogin}
                className="w-full bg-[#009975] hover:bg-[#e98232] text-white font-semibold py-3 rounded-md transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta? {" "}
              <Link
                to="/signup"
                className="text-[#009975] hover:text-[#e98232] font-medium transition-colors"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}