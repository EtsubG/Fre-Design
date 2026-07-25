import { motion } from 'framer-motion';
import { Scissors, Sparkles, HandHeart, Globe } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';

const CRAFT_IMAGE =
  'https://images.pexels.com/photos/5830695/pexels-photo-5830695.jpeg?auto=compress&cs=tinysrgb&w=1000';

const VALUES = [
  {
    Icon: HandHeart,
    title: 'Handwoven Heritage',
    text: 'Every fabric is woven by Ethiopian artisans preserving techniques passed down through generations.',
  },
  {
    Icon: Scissors,
    title: 'Bespoke Tailoring',
    text: 'Your measurements shape every cut. Each dress is made for one woman, and one woman alone.',
  },
  {
    Icon: Sparkles,
    title: 'Gold Embroidery',
    text: 'Intricate Tilet borders are hand-embroidered with golden thread for a finish that lasts a lifetime.',
  },
  {
    Icon: Globe,
    title: 'Worldwide Delivery',
    text: 'From Addis Ababa to your doorstep — insured express shipping to over 80 countries.',
  },
];

function Craftsmanship() {
  return (
    <section className="bg-cream-100 py-20 lg:py-28">
      <div className="container-luxury grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-luxury">
            <img
              src={CRAFT_IMAGE}
              alt="Artisan hands working with fabric at a sewing machine"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute -bottom-6 -right-4 w-44 rounded-2xl bg-brown-900 p-5 text-cream-100 shadow-luxury sm:-right-8 sm:w-52"
          >
            <p className="font-serif text-3xl text-gold-400">25+</p>
            <p className="mt-1 text-xs leading-snug text-cream-200/80">
              years of master craftsmanship
            </p>
          </motion.div>
        </motion.div>

        <div>
          <SectionTitle
            eyebrow="The Atelier"
            title="Crafted by Hand, Woven with Heritage"
            subtitle="In our Addis Ababa atelier, master tailors and weavers transform raw cotton and silk into dresses that carry the soul of Ethiopia."
            align="left"
          />

          <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                  <value.Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-brown-900">{value.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-brown-600">{value.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Craftsmanship;
