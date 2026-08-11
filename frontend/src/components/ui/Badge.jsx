const VARIANTS = {
  gold: 'bg-gold-100 text-gold-700 ring-1 ring-gold-200',
  dark: 'bg-brown-900 text-cream-100',
  light: 'bg-cream-100 text-brown-700 ring-1 ring-brown-200',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  error: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

function Badge({ children, variant = 'gold', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${VARIANTS[variant] || VARIANTS.gold} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
