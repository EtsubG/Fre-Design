export const APP_CONFIG = {
  name: 'FERE-DESIGN',
  tagline: 'Luxury Habesha Kemis',
  description:
    'Bespoke Ethiopian traditional dresses crafted with modern luxury and timeless elegance.',
  email: 'hello@fere-design.com',
  phone: '+251 11 555 0123',
  whatsapp: '+251 91 234 5678',
  address: 'Bole Road, Friendship Building, Addis Ababa, Ethiopia',
  hours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    pinterest: 'https://pinterest.com',
    tiktok: 'https://tiktok.com',
  },
  currency: 'USD',
  currencySymbol: '$',
  estimatedDeliveryWeeks: 4,
};

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Albums', path: '/albums' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const MEASUREMENT_FIELDS = [
  { key: 'height', label: 'Height', amharic: 'ቁመት', unit: 'cm', placeholder: '165' },
  { key: 'waist', label: 'Waist', amharic: 'ወገብ', unit: 'cm', placeholder: '72' },
  { key: 'dressLength', label: 'Dress Length', amharic: 'የቀሚስ ርዝመት', unit: 'cm', placeholder: '150' },
  { key: 'bust', label: 'Bust', amharic: 'ደረት', unit: 'cm', placeholder: '90' },
  { key: 'hips', label: 'Hips', amharic: 'ዳርቻ', unit: 'cm', placeholder: '96' },
  { key: 'shoulderWidth', label: 'Shoulder Width', amharic: 'ትከሻ ስፋት', unit: 'cm', placeholder: '38' },
  { key: 'sleeveLength', label: 'Sleeve Length', amharic: 'ክንል ርዝመት', unit: 'cm', placeholder: '58' },
  { key: 'armCircumference', label: 'Arm Circumference', amharic: 'ክንል ዙሪያ', unit: 'cm', placeholder: '28' },
];

export const ORDER_STEPS = [
  { id: 1, label: 'Details', description: 'Your contact information' },
  { id: 2, label: 'Measurements', description: 'Body measurements for tailoring' },
  { id: 3, label: 'Customization', description: 'Fabric and notes' },
  { id: 4, label: 'Review', description: 'Confirm and submit your order' },
];

export const ADMIN_NAV = [
  { label: 'Overview', path: '/admin' },
  { label: 'Orders', path: '/admin/orders' },
  { label: 'Products', path: '/admin/products' },
  { label: 'Messages', path: '/admin/messages' },
];

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Selamawit Bekele',
    location: 'Addis Ababa',
    rating: 5,
    quote:
      'The craftsmanship is unmatched. My wedding Habesha Kemis fit perfectly and felt truly mine. FERE-DESIGN made the day unforgettable.',
    image:
      'https://images.pexels.com/photos/3998013/pexels-photo-3998013.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 't2',
    name: 'Mahlet Tadesse',
    location: 'Washington, DC',
    rating: 5,
    quote:
      'Ordering from abroad was seamless. The custom measurements worked perfectly and the embroidery was breathtaking.',
    image:
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 't3',
    name: 'Hanna Girma',
    location: 'London',
    rating: 5,
    quote:
      'A perfect blend of heritage and modern elegance. The fabric quality and attention to detail exceeded every expectation.',
    image:
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'How long does a custom order take?',
    a: 'Each dress is handcrafted to your measurements. Production typically takes 3–4 weeks, plus shipping time depending on your location.',
  },
  {
    q: 'Can I provide my own measurements?',
    a: 'Yes. During the order process you can enter body measurements in centimeters. We also offer guidance on how to measure accurately.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'We ship worldwide via insured express courier. Shipping costs are calculated at checkout and a tracking number is provided.',
  },
  {
    q: 'What fabrics do you use?',
    a: 'We work with premium Ethiopian cotton, handwoven Tilet fabric, chiffon, and silk blends sourced from trusted local artisans.',
  },
];

export const FABRIC_OPTIONS = [
  { id: 'cotton', label: 'Handwoven Cotton', description: 'Breathable, authentic, traditional' },
  { id: 'chiffon', label: 'Chiffon', description: 'Light, flowing, elegant drape' },
  { id: 'silk', label: 'Silk Blend', description: 'Lustrous, premium, luxurious' },
  { id: 'tilet', label: 'Tilet Fabric', description: 'Handwoven with woven borders' },
];
