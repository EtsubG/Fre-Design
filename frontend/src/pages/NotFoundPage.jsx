import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

function NotFoundPage() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cream-100 px-4 text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-serif text-[10rem] leading-none text-gold-200 sm:text-[14rem]"
      >
        404
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="-mt-6 font-serif text-3xl text-brown-900 sm:text-4xl"
      >
        This Page Has Woven Away
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 max-w-md text-brown-600"
      >
        The page you are looking for could not be found. Let us guide you back to something beautiful.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 flex flex-wrap justify-center gap-4"
      >
        <Link to="/" className="btn-base bg-gold-gradient px-7 py-3.5 text-sm text-white shadow-gold">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Link to="/albums" className="btn-base border border-brown-300 px-7 py-3.5 text-sm text-brown-700 hover:border-gold-500">
          <ArrowLeft className="h-4 w-4" />
          Browse Albums
        </Link>
      </motion.div>
    </section>
  );
}

export default NotFoundPage;
