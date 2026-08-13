import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Badge from './ui/Badge';
import { formatCurrency } from '../utils';

function ProductCard({ product, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-100 shadow-soft">
          <img
            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brown-950/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {product.badge && (
            <div className="absolute left-4 top-4">
              <Badge variant="dark">
                {product.badge}
              </Badge>
            </div>
          )}

          <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="block w-full rounded-full bg-white/95 py-2.5 text-center text-sm font-medium text-brown-900 backdrop-blur-sm">
              View Details
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < product.rating ? 'fill-gold-400 text-gold-400' : 'text-brown-200'
                }`}
              />
            ))}
            <span className="ml-1 text-xs text-brown-400">{product.fabric}</span>
          </div>
          <h3 className="font-serif text-lg text-brown-900 transition-colors group-hover:text-gold-700">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-brown-700">
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

export default ProductCard;
