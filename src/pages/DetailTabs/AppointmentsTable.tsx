import { useSelector } from 'react-redux';
import { consultationSelector } from '../../redux/consultations/consultations.selector';
import { Consultation } from '../../redux/consultations/types/Consultations.interface';

export const AppointmentsTable = () => {
    const { consultations } = useSelector(consultationSelector).ui;
    return (
                <div>
                    <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[#26a69a]">
                                Consultas
                            </h2>
                        </div>
                            <div className="overflow-hidden rounded-2xl border border-[#26a69a]/15 bg-white/80 dark:border-[#26a69a]/20 dark:bg-slate-900/40">
                                <table className="min-w-full divide-y divide-[#26a69a]/15 border-collapse dark:divide-[#26a69a]/20">
                                    <thead className="bg-[#26a69a]/10 dark:bg-[#26a69a]/15">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                            Fecha de consulta
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                            Estado:
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                            Fecha de creación
                                        </th>
                                    </tr>
                                    </thead>
                                    {consultations && consultations.length > 0 ? (
                                        <tbody className="divide-y divide-[#26a69a]/10 bg-white/90 dark:divide-[#26a69a]/15 dark:bg-slate-900/40">
                                            {consultations.map((item: Consultation) => (
                                            <tr
                                                key={item.id}
                                                className="transition-colors duration-150 ease-in-out hover:bg-[#26a69a]/8 dark:hover:bg-[#26a69a]/10"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(item.scheduledAt).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {item.status}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {item.createdAt}
                                                </td>
                                            </tr>
                                            ))}
                                        </tbody>
                                        ) : (
                                        <tbody>
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                                                >
                                                    No hay consultas para este paciente.
                                                </td>
                                            </tr>
                                        </tbody>
                                        )}
                                </table>
                        </div>
                    </div>
                </div>
    )
}
