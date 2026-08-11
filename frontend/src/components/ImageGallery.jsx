import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

function ImageGallery({ images, alt }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  const go = useCallback((dir) => {
    setActive((prev) => (prev + dir + images.length) % images.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  const openLightbox = () => {
    setLightbox(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const closeLightbox = () => {
    setLightbox(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.5, 3));
  const zoomOut = () => {
    setZoom((z) => Math.max(z - 0.5, 1));
    if (zoom <= 1.5) setPan({ x: 0, y: 0 });
  };
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) setZoom((z) => Math.min(z + 0.3, 3));
    else setZoom((z) => {
      const nz = Math.max(z - 0.3, 1);
      if (nz <= 1) setPan({ x: 0, y: 0 });
      return nz;
    });
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };

  const handleMouseUp = () => setIsPanning(false);

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide lg:flex-col lg:overflow-visible">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); resetZoom(); }}
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
        <div
          className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-100 shadow-card"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
        >
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
              drag={false}
              style={{ pointerEvents: 'none' }}
            />
          </AnimatePresence>

          <div className="absolute right-4 top-4 flex gap-2">
            <button
              onClick={openLightbox}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brown-800 opacity-0 transition-opacity duration-300 hover:bg-white group-hover:opacity-100"
              aria-label="Expand image"
            >
              <Expand className="h-5 w-5" />
            </button>
          </div>

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

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-brown-950/70 px-4 py-1.5 text-xs text-cream-100 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            {active + 1} / {images.length}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-brown-950/95 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            onWheel={handleWheel}
          >
            <button
              className="absolute right-6 top-6 text-cream-100 transition-colors hover:text-gold-300"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="h-7 w-7" />
            </button>

            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 text-cream-100 transition-colors hover:text-gold-300"
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
              animate={{
                scale: zoom,
                opacity: 1,
                x: pan.x,
                y: pan.y,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e); }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
              draggable={false}
            />

            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 text-cream-100 transition-colors hover:text-gold-300"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              aria-label="Next image"
            >
              <ChevronRight className="h-9 w-9" />
            </button>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={zoomOut}
                disabled={zoom <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream-100 transition-colors hover:bg-white/20 disabled:opacity-30"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="min-w-[3rem] text-center text-xs text-cream-200">{Math.round(zoom * 100)}%</span>
              <button
                onClick={zoomIn}
                disabled={zoom >= 3}
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream-100 transition-colors hover:bg-white/20 disabled:opacity-30"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <div className="mx-1 h-5 w-px bg-white/20" />
              <button
                onClick={resetZoom}
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream-100 transition-colors hover:bg-white/20"
                aria-label="Reset zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ImageGallery;
