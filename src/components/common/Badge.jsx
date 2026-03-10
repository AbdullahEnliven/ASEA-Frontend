const badgeVariants = {
  default: 'bg-white/10 text-gray-300',
  success: 'bg-emerald-500/15 text-emerald-400',
  warning: 'bg-yellow-500/15 text-yellow-400',
  danger: 'bg-red-500/15 text-red-400',
  info: 'bg-blue-500/15 text-blue-400',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium
        ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
