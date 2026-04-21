interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-[#26a69a]/20 bg-white/90 shadow-sm backdrop-blur-sm dark:border-[#26a69a]/30 dark:bg-slate-900/70 ${className}`}
    >
      {/* Card Header */}
      <div className="px-5 py-4">
        <h3 className="font-display text-base font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h3>
        {desc && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {desc}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div className="border-t border-[#26a69a]/15 p-4 dark:border-[#26a69a]/20 sm:p-5">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
