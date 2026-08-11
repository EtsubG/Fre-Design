import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const VARIANTS = {
  success: { icon: CheckCircle2, accent: 'text-emerald-600', ring: 'ring-emerald-200' },
  error: { icon: AlertCircle, accent: 'text-red-600', ring: 'ring-red-200' },
  info: { icon: Info, accent: 'text-gold-600', ring: 'ring-gold-200' },
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message, variant = 'success', duration = 4000) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, variant }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      success: (msg, d) => notify(msg, 'success', d),
      error: (msg, d) => notify(msg, 'error', d),
      info: (msg, d) => notify(msg, 'info', d),
      dismiss,
    }),
    [notify, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:top-auto sm:items-end">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = VARIANTS[toast.variant] || VARIANTS.info;
            const Icon = config.icon;
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl bg-white px-4 py-3 shadow-luxury ring-1 sm:w-auto"
                role="status"
                aria-live="polite"
              >
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.accent}`} />
                <p className="flex-1 text-sm text-brown-800">{toast.message}</p>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="rounded-md p-0.5 text-brown-400 transition-colors hover:text-brown-700"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;
