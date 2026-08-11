import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className="text-brown-500 transition-colors hover:text-gold-700"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-gold-700' : 'text-brown-500'} aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-3.5 w-3.5 text-brown-300" />}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
