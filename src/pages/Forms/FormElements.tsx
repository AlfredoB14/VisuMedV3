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
      <div className="rounded-3xl border border-[#26a69a]/20 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-[#26a69a]/30 dark:bg-slate-900/70 lg:p-6">
        <div className="overflow-hidden rounded-2xl border border-[#26a69a]/15 bg-white/80 dark:border-[#26a69a]/20 dark:bg-slate-900/40">
          <table className="min-w-full divide-y divide-[#26a69a]/15 border-collapse dark:divide-[#26a69a]/20">
            <thead className="bg-[#26a69a]/10 dark:bg-[#26a69a]/15">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Paciente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Edad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Fecha de Alta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Última Consulta
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26a69a]/10 bg-white/90 dark:divide-[#26a69a]/15 dark:bg-slate-900/40">
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="cursor-pointer transition-colors duration-150 ease-in-out hover:bg-[#26a69a]/8 dark:hover:bg-[#26a69a]/10"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#26a69a] text-white shadow-sm">
                          {patient.avatar}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {patient.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {patient.age} años
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {patient.registrationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
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
