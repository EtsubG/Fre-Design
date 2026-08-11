import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

function TestimonialCard({ testimonial, index = 0 }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-luxury flex h-full flex-col gap-5 p-7"
    >
      <Quote className="h-8 w-8 text-gold-300" aria-hidden />
      <div className="flex items-center gap-1">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
        ))}
      </div>
      <blockquote className="flex-1 font-serif text-lg italic leading-relaxed text-brown-800">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="flex items-center gap-3 border-t border-brown-100 pt-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          loading="lazy"
          className="h-11 w-11 rounded-full object-cover ring-2 ring-gold-200"
        />
        <div>
          <p className="font-medium text-brown-900">{testimonial.name}</p>
          <p className="text-xs text-brown-500">{testimonial.location}</p>
        </div>
      </figcaption>
    </motion.figure>
  );
}

export default TestimonialCard;
