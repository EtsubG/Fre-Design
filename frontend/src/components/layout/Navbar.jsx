import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const LEFT_LINKS = [
  { label: 'Albums', path: '/albums' },
  { label: 'Our Story', path: '/about' },
];

const RIGHT_LINKS = [
  { label: 'Contact', path: '/contact' },
  { label: 'Admin', path: '/admin' },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-xs font-medium uppercase tracking-widest transition-colors ${
      isActive ? 'text-amber-700' : 'text-stone-800 hover:text-amber-700'
    }`;

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 bg-[#f5f0e8] shadow-[0_1px_0_rgba(0,0,0,0.08)]"
    >
      <nav className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-8 lg:px-16">
        {/* Left links — desktop */}
        <ul className="hidden items-center gap-10 lg:flex">
          {LEFT_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Brand name — always centered */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-xl font-bold uppercase tracking-[0.18em] text-stone-900 hover:text-amber-800 transition-colors"
        >
          FERE-DESIGN
        </Link>

        {/* Right links — desktop */}
        <ul className="hidden items-center gap-10 lg:flex">
          {RIGHT_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-stone-800 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-[#f5f0e8] lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-8 pb-6 pt-2">
              {[...LEFT_LINKS, ...RIGHT_LINKS].map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-widest transition-colors ${
                        isActive ? 'text-amber-700' : 'text-stone-800 hover:text-amber-700'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
