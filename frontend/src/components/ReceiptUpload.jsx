import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileCheck2, X } from 'lucide-react';

const MAX_SIZE_MB = 5;

function ReceiptUpload({ onUpload, accept = 'image/*,application/pdf' }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFile = (selected) => {
    setError(null);
    if (!selected) return;
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFile(selected);
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          onUpload?.(selected);
          return 100;
        }
        return p + 10;
      });
    }, 80);
  };

  const remove = () => {
    setFile(null);
    setProgress(0);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
        id="receipt-upload"
      />

      {!file ? (
        <label
          htmlFor="receipt-upload"
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-brown-200 bg-cream-50 px-6 py-8 text-center transition-colors hover:border-gold-400 hover:bg-gold-50/40"
        >
          <UploadCloud className="h-8 w-8 text-gold-500" />
          <div>
            <p className="text-sm font-medium text-brown-800">Upload a reference image</p>
            <p className="mt-0.5 text-xs text-brown-400">PNG, JPG or PDF — max {MAX_SIZE_MB}MB</p>
          </div>
        </label>
      ) : (
        <div className="flex items-center gap-3 rounded-xl bg-cream-100 p-4">
          <FileCheck2 className="h-6 w-6 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-brown-900">{file.name}</p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-brown-200">
              <motion.div
                className="h-full bg-gold-gradient"
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button
            onClick={remove}
            className="rounded-lg p-1 text-brown-400 transition-colors hover:bg-brown-200 hover:text-brown-700"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-xs text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ReceiptUpload;
