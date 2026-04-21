import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { createDoctor, doctorLogin } from "../../services/api";
import { useAppDispatch } from "../../redux/hooks";
import { setAuthState } from "../../redux/auth/auth.slice";

const ROLES = [
  { value: "radiologist", label: "Médico Radiólogo" },
  { value: "referring",   label: "Médico Referente"  },
  { value: "admin",       label: "Administrador"     },
];

export default function SignUpForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [firstName,    setFirstName]    = useState('');
  const [lastName,     setLastName]     = useState('');
  const [email,        setEmail]        = useState('');
  const [phone,        setPhone]        = useState('');
  const [role,         setRole]         = useState('radiologist');
  const [password,     setPassword]     = useState('');
  const [confirmPwd,   setConfirmPwd]   = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [accepted,     setAccepted]     = useState(false);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  const validate = (): string | null => {
    if (!firstName.trim())                          return 'Ingresa tu nombre.';
    if (!lastName.trim())                           return 'Ingresa tu apellido.';
    if (!email.trim() || !email.includes('@'))      return 'Ingresa un correo válido.';
    if (password.length < 6)                        return 'La contraseña debe tener al menos 6 caracteres.';
    if (password !== confirmPwd)                    return 'Las contraseñas no coinciden.';
    if (!accepted)                                  return 'Debes aceptar los términos y condiciones.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');
    try {
      // Create the doctor account
      await createDoctor({
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        email:     email.trim().toLowerCase(),
        phone:     phone.trim(),
        role,
        passwordHash: password,   // backend hashes this automatically
      });

      // Auto-login after successful registration
      const result = await doctorLogin(email.trim().toLowerCase(), password);
      dispatch(setAuthState({ isAuthenticated: true, doctor: result.doctor }));
      navigate('/home');
    } catch (err: any) {
      const msg = err.response?.data?.error ?? '';
      if (msg.toLowerCase().includes('email')) {
        setError('Este correo ya está registrado. Intenta iniciar sesión.');
      } else {
        setError(msg || 'Error al crear la cuenta. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto no-scrollbar lg:w-1/2">
      <div className="mx-auto mb-5 w-full max-w-md sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-[#26a69a] transition-colors hover:text-[#1f8c81]"
        >
          <ChevronLeftIcon className="size-5" />
          Regresa al inicio
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col justify-center flex-1 pb-10">
        <div>
          <div className="mb-6">
            <h1 className="mb-2 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              Crear cuenta
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Regístrate para acceder a la plataforma VisuMed
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
          >
            <div className="space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium text-[#26a69a]">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Juan"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); setError(''); }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="font-medium text-[#26a69a]">
                    Apellido <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="García"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); setError(''); }}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label className="font-medium text-[#26a69a]">
                  Correo electrónico <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="mt-1"
                />
              </div>

              {/* Phone */}
              <div>
                <Label className="font-medium text-[#26a69a]">
                  Teléfono <span className="text-slate-400 font-normal text-xs">(opcional)</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="+52 000 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Role */}
              <div>
                <Label className="font-medium text-[#26a69a]">
                  Rol <span className="text-red-500">*</span>
                </Label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 h-10 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-3.5 py-2 text-[13px] text-gray-800 shadow-theme-xs focus:border-[#26a69a] focus:outline-none focus:ring-2 focus:ring-[#26a69a]/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <Label className="font-medium text-[#26a69a]">
                  Contraseña <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword
                      ? <EyeIcon className="fill-gray-500 size-5" />
                      : <EyeCloseIcon className="fill-gray-500 size-5" />}
                  </span>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <Label className="font-medium text-[#26a69a]">
                  Confirmar contraseña <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    value={confirmPwd}
                    onChange={(e) => { setConfirmPwd(e.target.value); setError(''); }}
                  />
                  <span
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showConfirm
                      ? <EyeIcon className="fill-gray-500 size-5" />
                      : <EyeCloseIcon className="fill-gray-500 size-5" />}
                  </span>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={accepted}
                  onChange={(e) => { setAccepted(e.target.checked); setError(''); }}
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-[#26a69a]"
                />
                <label htmlFor="terms" className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer">
                  Acepto los{" "}
                  <span className="text-[#26a69a] font-medium">Términos y Condiciones</span>
                  {" "}y la{" "}
                  <span className="text-[#26a69a] font-medium">Política de Privacidad</span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-full bg-[#26a69a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f8c81] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/signin"
                className="font-medium text-[#26a69a] transition-colors hover:text-[#1f8c81]"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
