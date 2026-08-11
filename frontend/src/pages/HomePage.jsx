import Hero from '../components/home/Hero';
import FeaturedCollections from '../components/home/FeaturedCollections';
import Craftsmanship from '../components/home/Craftsmanship';
import Testimonials from '../components/home/Testimonials';
import CtaBanner from '../components/home/CtaBanner';

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <Craftsmanship />
      <Testimonials />
      <CtaBanner />
    </>
  );
}

export default HomePage;
