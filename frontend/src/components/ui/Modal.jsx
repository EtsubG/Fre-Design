import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

function Modal({ open = true, onClose, title, children, maxWidth, size }) {
  const widthClass = maxWidth || (size === 'lg' ? 'max-w-2xl' : 'max-w-lg');

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-brown-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel — scrolls independently, never taller than the viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 my-4 w-full ${widthClass} max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-white shadow-luxury`}
          >
            {title && (
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-brown-100 bg-white px-6 py-4">
                <h3 className="font-serif text-xl text-brown-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-brown-400 transition-colors hover:bg-brown-100 hover:text-brown-700"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
