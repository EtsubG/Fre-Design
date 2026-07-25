import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Globe2, Heart } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/ui/Breadcrumb';

const FOUNDER_IMAGE =
  'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1000';
const ATELIER_IMAGE =
  'https://images.pexels.com/photos/36356684/pexels-photo-36356684.jpeg?auto=compress&cs=tinysrgb&w=1000';

const STATS = [
  { Icon: Award, value: '25+', label: 'Years of Craft' },
  { Icon: Users, value: '2,400+', label: 'Happy Clients' },
  { Icon: Globe2, value: '80+', label: 'Countries Served' },
  { Icon: Heart, value: '100%', label: 'Handmade' },
];

function AboutPage() {
  return (
    <article className="pt-28">
      <section className="py-12">
        <div className="container-luxury">
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'About' }]} />
          <div className="mt-8 max-w-3xl">
            <SectionTitle
              eyebrow="Our Story"
              title="Heritage Reimagined for the Modern Woman"
              subtitle="FRE-DESIGN was born from a love of Ethiopian craftsmanship and a belief that tradition deserves a place in contemporary luxury."
              align="left"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-luxury grid items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-luxury">
              <img
                src={FOUNDER_IMAGE}
                alt="A woman representing the FRE-DESIGN atelier"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="font-serif text-3xl text-brown-900">From Addis Ababa to the World</h3>
            <div className="mt-5 space-y-4 leading-relaxed text-brown-600">
              <p>
                Founded in the heart of Addis Ababa, FRE-DESIGN began as a small atelier
                with a big vision: to honor the Habesha Kemis while making it accessible
                to women everywhere.
              </p>
              <p>
                We work directly with handloom weavers and master embroiderers, ensuring
                every fabric carries the authenticity of Ethiopian heritage. Then our
                tailors cut, stitch, and finish each dress to your exact measurements.
              </p>
              <p>
                Today, our dresses are worn at weddings, festivals, and ceremonies across
                more than 80 countries — yet every piece still begins the same way: by hand,
                in our atelier, with devotion.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-cream-100 py-16">
        <div className="container-luxury grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <stat.Icon className="h-8 w-8 text-gold-600" />
              <p className="mt-3 font-serif text-4xl text-brown-900">{stat.value}</p>
              <p className="mt-1 text-sm text-brown-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container-luxury grid items-center gap-14 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <SectionTitle
              eyebrow="Our Promise"
              title="Crafted With Conscience"
              align="left"
            />
            <ul className="mt-8 space-y-5">
              {[
                'Ethical wages for every weaver and tailor in our atelier',
                'Sustainable, natural fabrics sourced from local Ethiopian artisans',
                'Zero-waste pattern cutting to minimize our environmental footprint',
                'A portion of every sale supports weaving cooperatives in Gondar',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  <span className="text-brown-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <Button to="/collections" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Discover Our Pieces
              </Button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-luxury">
              <img
                src={ATELIER_IMAGE}
                alt="Close-up of artisan hands sewing fabric"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </article>
  );
}

export default AboutPage;
