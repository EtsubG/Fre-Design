import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import ProductGrid from '../ProductGrid';
import Button from '../ui/Button';
import { useFetch } from '../../hooks/useFetch';
import { getFeaturedProducts } from '../../services/productService';

function FeaturedCollections() {
  const { data: products, loading } = useFetch(getFeaturedProducts, []);

  return (
    <section className="py-20 lg:py-28">
      <div className="container-luxury">
        <SectionTitle
          eyebrow="Curated Selection"
          title="Featured Albums"
          subtitle="A glimpse of our most cherished pieces — each one tailored to celebrate the woman who wears it."
        />
        <div className="mt-14">
          <ProductGrid products={products} loading={loading} columns={4} />
        </div>
        <div className="mt-14 flex justify-center">
          <Button to="/albums" variant="outline" size="lg" rightIcon={<span>→</span>}>
            View All Albums
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollections;
