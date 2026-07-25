import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

function LanguageSwitch() {
  const { lang, toggle } = useLanguage();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-brown-700 transition-colors hover:bg-brown-100/60"
      aria-label={`Switch to ${lang === 'en' ? 'Amharic' : 'English'}`}
    >
      <Languages className="h-4 w-4" />
      <span>{lang === 'en' ? 'አማ' : 'EN'}</span>
    </button>
  );
}

export default LanguageSwitch;
