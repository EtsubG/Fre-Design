import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CTA_IMAGE from '../../assets/images/tilet.png';

function CtaBanner() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0">
       <img
  src={CTA_IMAGE}
  alt="CTA"
  className="w-full h-screen object-cover"
/>
        <div className="absolute inset-0 bg-brown-950/75" />
      </div>

      <div className="container-luxury relative text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="eyebrow text-gold-300"
        >
          Begin Your Journey
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-4 max-w-3xl font-serif text-4xl leading-tight text-cream-50 sm:text-5xl"
        >
          Your Dress, Woven for You Alone
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-5 max-w-xl text-cream-100/85"
        >
          Share your measurements, choose your fabric, and let our atelier craft a
          Habesha Kemis that is unmistakably yours.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex justify-center"
        >
          <Link
            to="/order"
            className="btn-base bg-gold-gradient px-8 py-4 text-sm text-white shadow-gold"
          >
            Start Your Custom Order
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default CtaBanner;
