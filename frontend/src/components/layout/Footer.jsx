import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import { APP_CONFIG, NAV_LINKS } from '../../constants';
import { isValidEmail } from '../../utils';
import { useToast } from '../../context/ToastContext';

function Footer() {
  const { success, error } = useToast();
  const [email, setEmail] = useState('');

  const subscribe = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      error('Please enter a valid email address.');
      return;
    }
    success('Thank you for subscribing. Welcome to the FERE-DESIGN circle.');
    setEmail('');
  };

  return (
    <footer className="bg-brown-950 text-cream-200">
      <div className="container-luxury grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-200/70">
            {APP_CONFIG.description}
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: Instagram, href: APP_CONFIG.social.instagram, label: 'Instagram' },
              { Icon: Facebook, href: APP_CONFIG.social.facebook, label: 'Facebook' },
              { Icon: Mail, href: `mailto:${APP_CONFIG.email}`, label: 'Email' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brown-900 text-cream-200 transition-all hover:bg-gold-gradient hover:text-white"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-400">
            Explore
          </h4>
          <ul className="space-y-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="text-cream-200/70 transition-colors hover:text-gold-300">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/order" className="text-cream-200/70 transition-colors hover:text-gold-300">
                Custom Order
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-400">
            Atelier
          </h4>
          <ul className="space-y-3 text-sm text-cream-200/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <span>{APP_CONFIG.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-gold-400" />
              <a href={`tel:${APP_CONFIG.phone}`} className="hover:text-gold-300">{APP_CONFIG.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold-400" />
              <a href={`mailto:${APP_CONFIG.email}`} className="hover:text-gold-300">{APP_CONFIG.email}</a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-400">
            The Atelier Letter
          </h4>
          <p className="mb-4 text-sm text-cream-200/70">
            New collections, atelier stories, and private invitations.
          </p>
          <form onSubmit={subscribe} className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email address for newsletter"
                className="w-full rounded-full border border-brown-800 bg-brown-900 px-4 py-3 pr-12 text-sm text-cream-100 placeholder-cream-200/40 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-gold-gradient text-white transition-transform hover:scale-105"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="border-t border-brown-900">
        <div className="container-luxury flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream-200/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {APP_CONFIG.name}. Crafted in Addis Ababa.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
