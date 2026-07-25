import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../constants';

function Logo({ light = false, className = '' }) {
  return (
    <Link
      to="/"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label={`${APP_CONFIG.name} home`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl font-serif text-xl font-bold transition-transform duration-500 group-hover:scale-105 ${
          light ? 'bg-cream-50 text-brown-900' : 'bg-brown-900 text-gold-400'
        }`}
      >
        F
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-xl tracking-wide ${light ? 'text-cream-50' : 'text-brown-900'}`}>
          {APP_CONFIG.name}
        </span>
        <span className={`text-[10px] uppercase tracking-widest ${light ? 'text-gold-300' : 'text-gold-600'}`}>
          {APP_CONFIG.tagline}
        </span>
      </span>
    </Link>
  );
}

export default Logo;
