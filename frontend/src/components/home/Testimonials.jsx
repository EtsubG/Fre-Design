import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import TestimonialCard from '../TestimonialCard';
import { TESTIMONIALS } from '../../constants';

function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-luxury">
        <SectionTitle
          eyebrow="Kind Words"
          title="Stories From Our Clients"
          subtitle="Women across the world wear FERE-DESIGN for their most cherished moments."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
