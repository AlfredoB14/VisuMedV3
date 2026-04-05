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
      <div className="mx-auto w-full max-w-md pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-[#26a69a] transition-colors hover:text-[#1f8c81]"
        >
          <ChevronLeftIcon className="size-5" />
          Regresa al inicio
        </Link>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col justify-center flex-1">
        <div>
          <div className="mb-8">
            <h1 className="mb-3 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              Iniciar Sesión
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              ¡Ingresa tus credenciales para acceder a tu cuenta!
            </p>
          </div>
          
          <form className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <div className="space-y-6">
              <div>
                <Label className="font-medium text-[#26a69a]">
                  Correo electrónico <span className="text-[#26a69a]">*</span>
                </Label>
                <Input 
                  placeholder="correo@ejemplo.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/80 p-3 focus:border-[#26a69a] focus:ring-1 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40"
                />
              </div>

              <div>
                <Label className="font-medium text-[#26a69a]">
                  Contraseña <span className="text-[#26a69a]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/80 p-3 focus:border-[#26a69a] focus:ring-1 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40"
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
                  className="text-sm text-[#26a69a] transition-colors hover:text-[#1f8c81]"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button 
                type="button"
                onClick={handleLogin}
                className="w-full rounded-full bg-[#26a69a] py-3 font-semibold text-white transition-colors hover:bg-[#1f8c81]"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              ¿No tienes una cuenta? {" "}
              <Link
                to="/signup"
                className="font-medium text-[#26a69a] transition-colors hover:text-[#1f8c81]"
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