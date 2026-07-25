import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ShoppingBag, Lock } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitch from '../ui/LanguageSwitch';
import { NAV_LINKS } from '../../constants';
import { useScrollPosition } from '../../hooks/useScrollPosition';

function Navbar() {
  const scrolled = useScrollPosition(30);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const solid = scrolled || !isHome || mobileOpen;

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? 'bg-cream-50/95 shadow-soft backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="container-luxury flex h-20 items-center justify-between gap-6">
        <Logo light={!solid} />

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `link-underline text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'text-gold-700'
                      : solid
                        ? 'text-brown-800 hover:text-gold-700'
                        : 'text-cream-100 hover:text-gold-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="ml-2 border-l border-current/20 pl-6">
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors ${
                solid ? 'text-brown-500 hover:text-gold-700' : 'text-cream-200/70 hover:text-gold-300'
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              Admin
            </Link>
          </li>
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitch />
          <Link
            to="/order"
            className={`btn-base gap-2 px-5 py-2.5 text-sm ${
              solid ? 'bg-gold-gradient text-white shadow-gold' : 'bg-white/90 text-brown-900'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Custom Order
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg lg:hidden ${
            solid ? 'text-brown-900' : 'text-cream-50'
          }`}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-cream-50 lg:hidden"
          >
            <ul className="container-luxury flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                        isActive ? 'bg-gold-50 text-gold-700' : 'text-brown-800 hover:bg-brown-50'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="mt-1 border-t border-brown-100 pt-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-brown-500 transition-colors hover:bg-brown-50 hover:text-gold-700"
                >
                  <Lock className="h-4 w-4" />
                  Admin
                </Link>
              </li>
              <li className="mt-2 flex items-center justify-between px-4">
                <LanguageSwitch />
                <Link
                  to="/order"
                  onClick={() => setMobileOpen(false)}
                  className="btn-base bg-gold-gradient px-5 py-2.5 text-sm text-white"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Custom Order
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
