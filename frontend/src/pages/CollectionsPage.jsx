import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/ui/Pagination';
import Breadcrumb from '../components/ui/Breadcrumb';
import { CATEGORIES } from '../constants';
import { getProducts } from '../services/productService';
import { useFetch } from '../hooks/useFetch';

const PER_PAGE = 6;

function CollectionsPage() {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);

  const { data: products, loading } = useFetch(
    () => getProducts({ category, sort }),
    [category, sort],
  );

  useEffect(() => {
    setPage(1);
  }, [category, sort]);

  const paged = useMemo(() => {
    if (!products) return [];
    const start = (page - 1) * PER_PAGE;
    return products.slice(start, start + PER_PAGE);
  }, [products, page]);

  const totalPages = Math.ceil((products?.length || 0) / PER_PAGE);

  return (
    <>
      <section className="bg-cream-100 pt-32 pb-12">
        <div className="container-luxury">
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Collections' }]} />
          <div className="mt-6">
            <SectionTitle
              eyebrow="Discover"
              title="Our Collections"
              subtitle="Bridal, festive, ceremonial and contemporary — every Habesha Kemis is a celebration of form, fabric, and heritage."
              align="left"
            />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-luxury">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    category === cat.id
                      ? 'bg-brown-900 text-cream-50 shadow-soft'
                      : 'bg-cream-100 text-brown-700 hover:bg-brown-100'
                  }`}
                  aria-pressed={category === cat.id}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-sm text-brown-600">
              <span className="hidden sm:inline">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-brown-200 bg-white px-4 py-2 text-sm text-brown-800 focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
          </div>

          <motion.div
            key={`${category}-${sort}-${page}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ProductGrid products={paged} loading={loading} columns={3} />
          </motion.div>

          <div className="mt-14">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default CollectionsPage;
