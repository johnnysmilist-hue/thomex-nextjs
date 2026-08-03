export function AdminPageHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <h1 className="text-[23px] font-normal leading-tight text-[#1d2327]">{title}</h1>
      {action}
    </div>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "border border-[#2271b1] bg-[#2271b1] text-white hover:bg-[#135e96] hover:border-[#135e96]"
      : "border border-[#2271b1] bg-white text-[#2271b1] hover:bg-[#f0f0f1]";
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-1.5 rounded-[3px] px-3 py-1.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${props.className || ""}`}
    >
      {children}
    </button>
  );
}

export function AdminPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[4px] border border-[#c3c4c7] bg-white p-4 shadow-sm">
      {children}
    </div>
  );
}
