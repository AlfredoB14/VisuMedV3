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
        <div>
            <PageMeta
                title="VisuMed | Registro de Paciente"
                description="Formulario para registrar un nuevo paciente en el sistema."
            />
            <PageBreadcrumb pageTitle="Registro de Nuevo Paciente" />
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Apellidos
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Estado
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Código Postal
                            </label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Dirección
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition"
                        >
                            Registrar Paciente
                        </button>
                    </form>

                    {/* Image Section */}
                    <div className="hidden lg:flex items-center justify-center">
                        <img
                            src="public/images/Doctor.jpg"
                            alt="Registro de Paciente"
                            className="max-w-md rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistry;
