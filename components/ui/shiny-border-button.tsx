type Props = {
  children: React.ReactNode;
  className?: string;
};

export function ShinyBorderButton({ children, className = "" }: Props) {
  return (
    <button
      className={`group relative overflow-hidden rounded-full p-px transition-transform duration-300 snappy hover:scale-[1.02] ${className}`}
      type="button"
    >
      <span className="absolute inset-[-50%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,#8b5cf6_40%,#06b6d4_50%,transparent_60%)]" />
      <span className="relative z-10 block rounded-full bg-[#0a0a0a] px-10 py-4 text-sm font-semibold text-white">
        {children}
      </span>
    </button>
  );
}
