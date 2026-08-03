import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/ProductGrid';
import Breadcrumb from '../components/ui/Breadcrumb';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { getProductsByAlbum, getAlbums } from '../services/productService';
import { useFetch } from '../hooks/useFetch';

const ALBUM_DESCRIPTIONS = {
  wedding: 'Bridal Kemis and ceremonial sets for the most cherished day.',
  'for-kids': 'Delightful Habesha dresses for the little ones.',
  casual: 'Everyday elegance with comfort and heritage.',
  holidays: 'Festive gowns for celebration and joy.',
};

function AlbumsPage() {
  const { albumSlug } = useParams();
  const navigate = useNavigate();

  const { data: albums } = useFetch(getAlbums, []);
  const showGallery = Boolean(albumSlug);

  const { data: albumData, loading } = useFetch(
    () => showGallery ? getProductsByAlbum(albumSlug) : Promise.resolve({ data: { album: null, products: [] } }),
    [albumSlug],
  );

  const products = albumData?.products || [];
  const albumName = albumData?.album?.name;
  const albumDesc = albumSlug ? ALBUM_DESCRIPTIONS[albumSlug] : '';

  const sortedAlbums = useMemo(
    () => [...(albums || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    [albums],
  );

  if (showGallery) {
    return (
      <>
        <section className="bg-cream-100 pt-32 pb-10">
          <div className="container-luxury">
            <Breadcrumb
              items={[
                { label: 'Home', path: '/' },
                { label: 'Albums', path: '/albums' },
                ...(albumName ? [{ label: albumName }] : []),
              ]}
            />
            <button
              onClick={() => navigate('/albums')}
              className="mt-6 inline-flex items-center gap-2 text-sm text-brown-600 transition-colors hover:text-gold-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Albums
            </button>
            <div className="mt-4">
              <SectionTitle
                eyebrow="Collection"
                title={albumName || 'Loading…'}
                subtitle={albumDesc}
                align="left"
              />
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container-luxury">
            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="font-serif text-2xl text-brown-800">No pieces in this album yet</p>
                <p className="mt-2 text-brown-500">Please check back soon for new additions.</p>
                <Button to="/albums" variant="outline" className="mt-6">Browse All Albums</Button>
              </div>
            ) : (
              <motion.div
                key={albumSlug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductGrid products={products} loading={loading} columns={3} />
              </motion.div>
            )}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-cream-100 pt-32 pb-12">
        <div className="container-luxury">
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'Albums', path: '/albums' },
            ]}
          />
          <div className="mt-6">
            <SectionTitle
              eyebrow="Discover"
              title="Our Albums"
              subtitle="Wedding, kids, casual, and festive — every Habesha Kemis is a celebration of form, fabric, and heritage."
              align="left"
            />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-luxury">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {sortedAlbums.map((album, index) => (
              <AlbumCover
                key={album.id}
                album={album}
                index={index}
                description={ALBUM_DESCRIPTIONS[album.slug] || ''}
                onClick={() => navigate(`/albums/${album.slug}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function AlbumCover({ album, index, description, onClick }) {
  const { data, loading } = useFetch(() => getProductsByAlbum(album.slug), [album.slug]);
  const products = data?.products || [];
  const coverImg = album.cover_image_url;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-100 shadow-soft">
        {coverImg ? (
          <img
            src={coverImg}
            alt={album.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brown-950/75 via-brown-950/10 to-transparent" />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
          <div>
            <h3 className="font-serif text-xl text-cream-50 drop-shadow-sm">{album.name}</h3>
            <p className="mt-1 text-xs text-cream-200/80">{products.length} {products.length === 1 ? 'piece' : 'pieces'}</p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-50/90 text-brown-900 transition-all duration-500 group-hover:bg-gold-500 group-hover:text-white">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm text-brown-500">{description}</p>
    </motion.article>
  );
}

export default AlbumsPage;
