import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import heroImg from '../../assets/images/hero.jpg';

const HERO_IMAGE = heroImg;

function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Woman wearing an elegant ivory Habesha Kemis with gold jewelry"
          className="h-full w-full object-cover object-center animate-slow-zoom"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      <div className="container-luxury relative flex min-h-[92vh] flex-col justify-center">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow text-gold-300"
          >
            Ethiopian Heritage · Modern Luxury
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 font-serif text-5xl leading-[1.05] text-cream-50 text-shadow-luxury sm:text-6xl lg:text-7xl"
          >
            The Art of the
            <span className="block italic text-gold-300">Habesha Kemis</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-cream-100/90"
          >
            Bespoke dresses handcrafted to your measurements — where centuries of
            Ethiopian artistry meet contemporary elegance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              to="/collections"
              className="btn-base bg-gold-gradient px-8 py-4 text-sm text-white shadow-gold"
            >
              Explore Collections
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/order"
              className="btn-base border border-cream-100/40 px-8 py-4 text-sm text-cream-50 backdrop-blur-sm hover:bg-white/10"
            >
              Begin Custom Order
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-12 flex items-center gap-6 text-cream-100/80"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
              ))}
            </div>
            <p className="text-sm">
              <span className="font-semibold text-cream-50">2,400+</span> dresses tailored with love
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-12 w-7 justify-center rounded-full border border-cream-100/30 pt-2">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-gold-300"
          />
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
