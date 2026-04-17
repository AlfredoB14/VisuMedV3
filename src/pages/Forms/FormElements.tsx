import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PatientHistory from "./components/patientHistory";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { getPatients } from "../../redux/patients/patients.action";
import { useAppDispatch } from "../../redux/hooks";
import { Patient } from "../../redux/patients/types/Patients.interface";


export default function FormElements() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const patients = useSelector((state: RootState) => state.patients.ui.patients);
  const dispatch = useAppDispatch();
  const doctor = useSelector((state: RootState) => state.auth.doctor);
  useEffect(() => {
    if (doctor?.id) {
      dispatch(getPatients(doctor.id));
    }
  }, [dispatch, doctor?.id]);
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
              {patients?.map((patient) => (
                <tr
                  key={patient.firstName}
                  className="cursor-pointer transition-colors duration-150 ease-in-out hover:bg-[#26a69a]/8 dark:hover:bg-[#26a69a]/10"
                  onClick={() => setSelectedPatient(patient as unknown as Patient)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#26a69a] text-white shadow-sm">
                          {patient.firstName.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {patient.firstName} {patient.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {patient.birthDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {patient.lastConsultationAt ? new Date(patient.lastConsultationAt).toLocaleDateString() : "No hay consulta" }
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