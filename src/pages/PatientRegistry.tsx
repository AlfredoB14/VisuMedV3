import { useState } from "react";
import { useSelector } from "react-redux";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { createPatient } from "../redux/patients/patients.action";
import { useAppDispatch } from "../redux/hooks";
import { CreatePatientPayload } from "../redux/patients/types/Patients.interface";
import { RootState } from "../redux/store";
import { ROUTES } from "../routes/routes";
import { useNavigate } from "react-router";

const PatientRegistry: React.FC = () => {
  const doctor = useSelector((state: RootState) => state.auth.doctor);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    state: "",
    postalCode: "",
    email: "",
    phone: "",
    birthDate: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (doctor?.id) {
      dispatch(
        createPatient({
          ...formData,
          doctorId: doctor.id,
        } as CreatePatientPayload),
      );
      navigate(ROUTES.APP.HOME);
      setFormData({
        firstName: "",
        lastName: "",
        state: "",
        postalCode: "",
        email: "",
        phone: "",
        birthDate: "",
        address: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageMeta
        title="VisuMed | Registro de Paciente"
        description="Formulario para registrar un nuevo paciente en el sistema."
      />

      <PageBreadcrumb pageTitle="Registro de Nuevo Paciente" />

      <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 lg:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            autoComplete="off"
          >
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-slate-700 dark:text-slate-400"
              >
                Nombre
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-slate-700 dark:text-slate-400"
              >
                Apellidos
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-slate-700 dark:text-slate-400"
              >
                Estado
              </label>
              <input
                id="state"
                type="text"
                name="state"
                autoComplete="address-level1"
                value={formData.state}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-slate-700 dark:text-slate-400"
              >
                Código Postal
              </label>
              <input
                id="postalCode"
                type="text"
                name="postalCode"
                autoComplete="postal-code"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-400"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-700 dark:text-slate-400"
              >
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-slate-700 dark:text-slate-400"
              >
                Fecha de Nacimiento
              </label>
              <input
                id="birthDate"
                type="date"
                name="birthDate"
                autoComplete="bday"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-700 dark:text-slate-400"
              >
                Dirección
              </label>
              <input
                id="address"
                type="text"
                name="address"
                autoComplete="street-address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#26a69a] px-4 py-3 font-medium text-white transition hover:bg-[#1f8c81]"
            >
              Registrar Paciente
            </button>
          </form>

          <div className="hidden items-center justify-center lg:flex">
            <img
              src="/images/Doctor.jpg"
              alt="Registro de Paciente"
              className="max-w-md rounded-[2rem] shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistry;