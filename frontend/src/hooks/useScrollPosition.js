import { useEffect, useState } from 'react';

/**
 * Tracks scroll position and reports whether the page has scrolled past a threshold.
 * Used to toggle the navbar between transparent and solid states.
 */
export function useScrollPosition(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
