import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PatientHistory from "./components/patientHistory";

interface Patient {
  id: number;
  name: string;
  age: number;
  registrationDate: string;
  lastConsultation: string;
  avatar: string;
}

export default function FormElements() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const patients = [
    { id: 1, name: "María García", age: 34, registrationDate: "15/03/2023", lastConsultation: "22/05/2023", avatar: "MG" },
    { id: 2, name: "Juan López", age: 45, registrationDate: "10/01/2023", lastConsultation: "05/06/2023", avatar: "JL" },
    { id: 3, name: "Ana Martínez", age: 28, registrationDate: "22/02/2023", lastConsultation: "14/04/2023", avatar: "AM" },
    { id: 4, name: "Carlos Rodríguez", age: 52, registrationDate: "03/04/2023", lastConsultation: "12/05/2023", avatar: "CR" },
    { id: 5, name: "Laura Sánchez", age: 39, registrationDate: "18/05/2023", lastConsultation: "01/06/2023", avatar: "LS" },
    { id: 6, name: "Roberto Fernández", age: 47, registrationDate: "02/02/2023", lastConsultation: "29/05/2023", avatar: "RF" },
    { id: 7, name: "Sofia González", age: 31, registrationDate: "07/01/2023", lastConsultation: "18/04/2023", avatar: "SG" },
    { id: 8, name: "Miguel Torres", age: 42, registrationDate: "25/03/2023", lastConsultation: "10/06/2023", avatar: "MT" },
    { id: 9, name: "Patricia Ruiz", age: 36, registrationDate: "12/04/2023", lastConsultation: "02/06/2023", avatar: "PR" }
  ];

  if (selectedPatient) {
    return <PatientHistory patient={selectedPatient} onBack={() => setSelectedPatient(null)} />;
  }

  return (
    <div>
      <PageMeta
        title="Historiales Clinicos"
        description=""
      />
      <PageBreadcrumb pageTitle="Tus historiales clínicos" />
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="overflow-hidden rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Alta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Consulta
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 ease-in-out cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                          {patient.avatar}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {patient.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {patient.age} años
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {patient.registrationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {patient.lastConsultation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
