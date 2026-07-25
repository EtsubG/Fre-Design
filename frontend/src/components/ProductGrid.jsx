import ProductCard from './ProductCard';
import Spinner from './ui/Spinner';

function ProductGrid({ products, loading, columns = 4 }) {
  const colClass =
    columns === 3
      ? 'sm:grid-cols-2 lg:grid-cols-3'
      : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-serif text-2xl text-brown-800">No pieces found</p>
        <p className="mt-2 text-brown-500">Try adjusting your filters to discover more.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-x-6 gap-y-10 ${colClass}`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

export default ProductGrid;
