import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

export default function Blank() {
  return (
    <div>
      <PageMeta
        title="VisuMed"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Blank Page" />
      <div className="min-h-screen rounded-3xl border border-[#26a69a]/20 bg-white/90 px-5 py-7 shadow-sm backdrop-blur-sm dark:border-[#26a69a]/30 dark:bg-slate-900/70 xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="font-display mb-4 text-theme-xl font-semibold text-slate-800 dark:text-slate-100 sm:text-2xl">
            Card Title Here
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Start putting content on grids or panels, you can also use different
            combinations of grids.Please check out the dashboard and other pages
          </p>
        </div>
      </div>
    </div>
  );
}
