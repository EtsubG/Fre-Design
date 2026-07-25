import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

function ImageGallery({ images, alt }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const go = (dir) => {
    setActive((prev) => (prev + dir + images.length) % images.length);
  };

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide lg:flex-col lg:overflow-visible">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl transition-all ${
              active === i ? 'ring-2 ring-gold-500 ring-offset-2' : 'ring-1 ring-brown-200 opacity-70 hover:opacity-100'
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-100 shadow-card">
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={images[active]}
              alt={alt}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full object-cover"
            />
          </AnimatePresence>

          <button
            onClick={() => setLightbox(true)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brown-800 opacity-0 transition-opacity duration-300 hover:bg-white group-hover:opacity-100"
            aria-label="Expand image"
          >
            <Expand className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brown-800 opacity-0 transition-all hover:bg-white group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brown-800 opacity-0 transition-all hover:bg-white group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-brown-950/90 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute right-6 top-6 text-cream-100 hover:text-gold-300"
              onClick={() => setLightbox(false)}
              aria-label="Close lightbox"
            >
              <X className="h-7 w-7" />
            </button>
            <button
              className="absolute left-6 text-cream-100 hover:text-gold-300"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-9 w-9" />
            </button>
            <motion.img
              key={active}
              src={images[active]}
              alt={alt}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-6 text-cream-100 hover:text-gold-300"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              aria-label="Next image"
            >
              <ChevronRight className="h-9 w-9" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ImageGallery;
