import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

const PatientRegistry: React.FC = () => {
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
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        // Add logic to save the patient data
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
                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-400">
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-400">
                                Apellidos
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-400">
                                Estado
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-400">
                                Código Postal
                            </label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-400">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-400">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-400">
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-400">
                                Dirección
                            </label>
                            <input
                                type="text"
                                name="address"
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

                    {/* Image Section */}
                    <div className="hidden lg:flex items-center justify-center">
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
