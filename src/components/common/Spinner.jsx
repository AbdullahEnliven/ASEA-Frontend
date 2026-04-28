export default function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-1 w-8',
    md: 'h-1.5 w-12',
    lg: 'h-1.5 w-20',
  };

  return (
    <span
      className={`relative inline-flex overflow-hidden rounded-full bg-current/20 text-[#007f75] ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="asea-load-progress absolute inset-y-0 left-0 rounded-full bg-current" />
    </span>
  );
}
