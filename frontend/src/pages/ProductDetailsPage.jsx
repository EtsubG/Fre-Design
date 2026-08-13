import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, ShieldCheck, RefreshCw, Clock, Scissors } from 'lucide-react';
import ImageGallery from '../components/ImageGallery';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Breadcrumb from '../components/ui/Breadcrumb';
import Spinner from '../components/ui/Spinner';
import SectionTitle from '../components/ui/SectionTitle';
import ProductCard from '../components/ProductCard';
import { useFetch } from '../hooks/useFetch';
import { getProductById, getRelatedProducts } from '../services/productService';
import { normalizeImages } from '../constants/albumImages';
import heroImg from '../assets/images/hero.jpg';
import { formatCurrency } from '../utils';

const PERKS = [
  { Icon: Truck, label: 'Free insured shipping' },
  { Icon: ShieldCheck, label: 'Quality guaranteed' },
  { Icon: RefreshCw, label: 'Free alterations' },
];

function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(() => getProductById(id), [id]);

  const albumId = product?.album?.id || product?.album_id;
  const { data: related } = useFetch(
    () => (albumId ? getRelatedProducts(id, albumId, 3) : Promise.resolve({ data: [] })),
    [albumId, id],
  );

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
        <Button to="/albums" variant="outline">Back to Albums</Button>
      </div>
    );
  }

  const images = (() => {
    const imgs = product.images && product.images.length > 0 ? product.images : [heroImg];
    // Ensure plain strings (guard against any shape inconsistency)
    return normalizeImages(imgs.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean));
  })();

  return (
    <article className="pt-28">
      <div className="container-luxury">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: 'Albums', path: '/albums' },
            ...(product.album ? [{ label: product.album.name, path: `/albums/${product.album.slug}` }] : []),
            { label: product.name },
          ]}
        />
      </div>

      <section className="py-12">
        <div className="container-luxury grid gap-12 lg:grid-cols-2">
          <ImageGallery images={images} alt={product.name} />

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

            <p className="mt-6 font-serif text-3xl text-brown-900">
              {formatCurrency(product.price)}
            </p>

            <p className="mt-5 leading-relaxed text-brown-600">{product.description}</p>

            <div className="mt-8 space-y-4 rounded-2xl border border-brown-100 bg-cream-50 p-5">
              <div className="flex items-center gap-3">
                <Scissors className="h-5 w-5 text-gold-600" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-brown-400">Fabric</p>
                  <p className="text-sm font-medium text-brown-800">{product.fabric}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gold-600" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-brown-400">Estimated Tailoring Time</p>
                  <p className="text-sm font-medium text-brown-800">{product.tailoringTime || '3-4 weeks'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gold-600" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-brown-400">Estimated Delivery Time</p>
                  <p className="text-sm font-medium text-brown-800">{product.deliveryTime || '1-2 weeks'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/order"
                state={{ productId: product.id, productName: product.name, price: product.price }}
                className="btn-base flex w-full items-center justify-center gap-2 bg-gold-gradient px-8 py-4 text-sm text-white shadow-gold"
              >
                <ShoppingBag className="h-4 w-4" />
                Order Now
              </Link>
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

      {(related || []).length > 0 && (
        <section className="bg-cream-100 py-20">
          <div className="container-luxury">
            <SectionTitle
              eyebrow="You May Also Love"
              title="Complete the Look"
              align="left"
            />
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {(related || []).map((p, i) => (
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
