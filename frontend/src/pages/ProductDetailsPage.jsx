import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Truck, ShieldCheck, RefreshCw, Star } from 'lucide-react';
import ImageGallery from '../components/ImageGallery';
import ColorSelector from '../components/ui/ColorSelector';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Breadcrumb from '../components/ui/Breadcrumb';
import Spinner from '../components/ui/Spinner';
import SectionTitle from '../components/ui/SectionTitle';
import ProductCard from '../components/ProductCard';
import { useFetch } from '../hooks/useFetch';
import { getProductById, getProducts } from '../services/productService';
import { formatCurrency } from '../utils';
import { COLOR_SWATCHES, APP_CONFIG } from '../constants';
import { useToast } from '../context/ToastContext';

const PERKS = [
  { Icon: Truck, label: 'Free insured shipping' },
  { Icon: ShieldCheck, label: 'Quality guaranteed' },
  { Icon: RefreshCw, label: 'Free alterations' },
];

function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(() => getProductById(id), [id]);
  const { data: allProducts } = useFetch(() => getProducts(), []);
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);
  const toast = useToast();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-20 text-center">
        <p className="font-serif text-3xl text-brown-900">Piece not found</p>
        <p className="text-brown-500">The piece you are looking for may no longer be available.</p>
        <Button to="/collections" variant="outline">Back to Collections</Button>
      </div>
    );
  }

  const related = (allProducts || [])
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const colorLabels = product.colors
    .map((c) => COLOR_SWATCHES.find((s) => s.id === c)?.label)
    .filter(Boolean)
    .join(' · ');

  const handleOrder = () => {
    toast.success(`${product.name} added to your order. Continue to measurements.`);
  };

  return (
    <article className="pt-28">
      <div className="container-luxury">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: 'Collections', path: '/collections' },
            { label: product.name },
          ]}
        />
      </div>

      <section className="py-12">
        <div className="container-luxury grid gap-12 lg:grid-cols-2">
          <ImageGallery images={product.images} alt={product.name} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3">
              {product.badge && <Badge variant="gold">{product.badge}</Badge>}
              <span className="text-xs uppercase tracking-widest text-gold-600">
                {product.fabric}
              </span>
            </div>

            <h1 className="mt-4 font-serif text-4xl leading-tight text-brown-900 lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < product.rating ? 'fill-gold-400 text-gold-400' : 'text-brown-200'}`}
                />
              ))}
              <span className="text-sm text-brown-500">({product.rating}.0)</span>
            </div>

            <p className="mt-6 font-serif text-3xl text-brown-900">
              {formatCurrency(product.price)}
            </p>

            <p className="mt-5 leading-relaxed text-brown-600">{product.description}</p>

            <div className="mt-8 space-y-6">
              <ColorSelector
                selected={selectedColor}
                onChange={setSelectedColor}
                availableColors={product.colors}
              />

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-brown-800">Quantity</span>
                <div className="flex items-center rounded-full border border-brown-200">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-l-full text-brown-600 hover:bg-brown-100"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-medium" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-r-full text-brown-600 hover:bg-brown-100"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/order"
                  state={{ productId: product.id, productName: product.name, price: product.price, color: selectedColor, qty }}
                  className="btn-base flex-1 bg-gold-gradient px-8 py-4 text-sm text-white shadow-gold"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Order Custom Fit
                </Link>
                <button
                  onClick={handleOrder}
                  className="btn-base border border-brown-300 px-5 py-4 text-brown-700 hover:border-gold-500 hover:text-gold-700"
                  aria-label="Save to wishlist"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-brown-500">
                Color options: {colorLabels}. Each dress is tailored in approximately{' '}
                {APP_CONFIG.estimatedDeliveryWeeks} weeks.
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-3 border-t border-brown-100 pt-6 sm:grid-cols-3">
              {PERKS.map((perk) => (
                <li key={perk.label} className="flex items-center gap-2 text-sm text-brown-600">
                  <perk.Icon className="h-4 w-4 text-gold-600" />
                  {perk.label}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-cream-100 py-20">
          <div className="container-luxury">
            <SectionTitle
              eyebrow="You May Also Love"
              title="Complete the Look"
              align="left"
            />
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

export default ProductDetailsPage;
