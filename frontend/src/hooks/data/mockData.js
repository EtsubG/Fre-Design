import heroImg from '../../assets/images/hero.jpg';
import casualImg from '../../assets/images/casual.jpg';

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Aurora Bridal Kemis',
    category: 'wedding',
    price: 420,
    rating: 5,
    featured: true,
    badge: 'Bridal',
    colors: ['ivory', 'gold'],
    fabric: 'Silk Blend',
    description:
      'A luminous bridal Habesha Kemis in ivory silk blend, finished with hand-embroidered gold Tilet borders. Designed for the bride who carries heritage with grace.',
    images: [heroImg, casualImg, heroImg],
  },
  {
    id: 'p2',
    name: 'Selam Festive Gown',
    category: 'festive',
    price: 285,
    rating: 5,
    featured: true,
    badge: 'Bestseller',
    colors: ['crimson', 'gold'],
    fabric: 'Handwoven Cotton',
    description:
      'A vibrant crimson Habesha Kemis with woven gold borders, made for celebration. Lightweight cotton drapes beautifully through every festivity.',
    images: [casualImg, heroImg, casualImg],
  },
  {
    id: 'p3',
    name: 'Habesha Ceremonial Robe',
    category: 'ceremonial',
    price: 365,
    rating: 5,
    featured: true,
    badge: 'Heritage',
    colors: ['emerald', 'gold'],
    fabric: 'Tilet Fabric',
    description:
      'An emerald ceremonial Kemis in authentic handwoven Tilet fabric. Rich color, intricate borders, and a silhouette of quiet authority.',
    images: [heroImg, casualImg, heroImg],
  },
  {
    id: 'p4',
    name: 'Lumina Contemporary Kemis',
    category: 'contemporary',
    price: 240,
    rating: 4,
    featured: true,
    badge: 'New',
    colors: ['sapphire', 'ivory'],
    fabric: 'Chiffon',
    description:
      'A modern interpretation of the Habesha Kemis in flowing sapphire chiffon. Minimalist borders meet a contemporary, versatile silhouette.',
    images: [casualImg, heroImg, casualImg],
  },
  {
    id: 'p5',
    name: 'Nigist Royal Gown',
    category: 'ceremonial',
    price: 510,
    rating: 5,
    featured: false,
    badge: 'Limited',
    colors: ['brown', 'gold'],
    fabric: 'Silk Blend',
    description:
      'The Nigist royal gown in espresso and gold — a statement of regal elegance. Hand-embroidered borders and a sculpted silhouette for the most distinguished occasions.',
    images: [heroImg, casualImg, heroImg],
  },
  {
    id: 'p6',
    name: 'Tiru Minimalist Kemis',
    category: 'contemporary',
    price: 195,
    rating: 4,
    featured: false,
    badge: 'New',
    colors: ['black', 'ivory'],
    fabric: 'Chiffon',
    description:
      'A minimalist onyx chiffon Kemis with delicate ivory borders. Understated luxury for the woman who lets craftsmanship speak for itself.',
    images: [casualImg, heroImg, casualImg],
  },
];

export const MOCK_ORDERS = [
  {
    id: 'FD-1024',
    customer: 'Selamawit Bekele',
    email: 'selamawit@example.com',
    product: 'Aurora Bridal Kemis',
    date: '2026-07-18',
    status: 'In Production',
    total: 420,
  },
  {
    id: 'FD-1025',
    customer: 'Mahlet Tadesse',
    email: 'mahlet@example.com',
    product: 'Selam Festive Gown',
    date: '2026-07-20',
    status: 'Measurements Received',
    total: 285,
  },
  {
    id: 'FD-1026',
    customer: 'Hanna Girma',
    email: 'hanna@example.com',
    product: 'Habesha Ceremonial Robe',
    date: '2026-07-22',
    status: 'Shipped',
    total: 365,
  },
  {
    id: 'FD-1027',
    customer: 'Abel Kebede',
    email: 'abel@example.com',
    product: 'Lumina Contemporary Kemis',
    date: '2026-07-23',
    status: 'Pending',
    total: 240,
  },
];

export const MOCK_MESSAGES = [
  {
    id: 'm1',
    name: 'Ruth Alemu',
    email: 'ruth@example.com',
    subject: 'Custom bridal consultation',
    date: '2026-07-22',
    message:
      'I am getting married in October and would love a custom ivory bridal Kemis with gold embroidery. Could we schedule a consultation?',
    read: false,
  },
  {
    id: 'm2',
    name: 'Dawit Haile',
    email: 'dawit@example.com',
    subject: 'Wholesale inquiry',
    date: '2026-07-21',
    message:
      'I run a boutique in Frankfurt and would like to discuss carrying your collection. What are your wholesale terms?',
    read: true,
  },
];
