import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/images/hero.jpg';

function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background image — fully bright, no dark overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Woman wearing an elegant Habesha Kemis"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
      </div>

      {/* Centered content over image */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-white"
          style={{ textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}
        >
          Ethiopian Heritage · Modern Luxury
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-5xl leading-[1.1] text-black sm:text-6xl lg:text-7xl"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
        >
          <span className="italic">Habesha</span>
          <span className="block">Kemis</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10"
        >
          <Link
            to="/albums"
            className="inline-flex items-center justify-center rounded-full bg-white px-12 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-cream-100"
          >
            View Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
