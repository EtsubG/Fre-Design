/**
 * Seed script — creates all albums and products in MongoDB.
 * Run ONCE with the backend server stopped:
 *   node seedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Album   = require('./models/Album');
const Product = require('./models/Product');

const ALBUMS = [
  { name: 'Wedding',  slug: 'wedding',  sortOrder: 1 },
  { name: 'For Kids', slug: 'for-kids', sortOrder: 2 },
  { name: 'Casual',   slug: 'casual',   sortOrder: 3 },
  { name: 'Holidays', slug: 'holidays', sortOrder: 4 },
];

// Products reference album by slug for easy matching
const PRODUCTS = [
  {
    albumSlug: 'wedding',
    name: 'Aurora Bridal Kemis',
    description: 'A luminous bridal Habesha Kemis in ivory silk blend, finished with hand-embroidered gold Tilet borders.',
    fabricDetails: 'Silk Blend',
    price: 420,
    estimatedTailoringTime: '3-4 weeks',
    deliveryTime: '1-2 weeks',
    badge: 'Bridal',
    isFeatured: true,
    images: [],
  },
  {
    albumSlug: 'wedding',
    name: 'Nigist Royal Gown',
    description: 'A regal gown fit for royalty, featuring rich fabrics and elegant draping for the discerning bride.',
    fabricDetails: 'Premium Silk Blend',
    price: 650,
    estimatedTailoringTime: '4-5 weeks',
    deliveryTime: '1-2 weeks',
    badge: 'Limited',
    isFeatured: true,
    images: [],
  },
  {
    albumSlug: 'for-kids',
    name: 'Selam Kids Kemis',
    description: 'Adorable traditional kemis for little ones, crafted with the same care and quality as our adult pieces.',
    fabricDetails: 'Soft Cotton',
    price: 180,
    estimatedTailoringTime: '2 weeks',
    deliveryTime: '1 week',
    badge: 'For Kids',
    isFeatured: false,
    images: [],
  },
  {
    albumSlug: 'casual',
    name: 'Tiru Minimalist Kemis',
    description: 'A clean, minimalist take on the traditional kemis — perfect for everyday elegance.',
    fabricDetails: 'Lightweight Cotton',
    price: 240,
    estimatedTailoringTime: '2-3 weeks',
    deliveryTime: '1 week',
    badge: 'Casual',
    isFeatured: true,
    images: [],
  },
  {
    albumSlug: 'holidays',
    name: 'Selam Festive Gown',
    description: 'A stunning festive gown designed to make every celebration memorable.',
    fabricDetails: 'Premium Cotton',
    price: 420,
    estimatedTailoringTime: '3-4 weeks',
    deliveryTime: '1-2 weeks',
    badge: 'Bestseller',
    isFeatured: true,
    images: [],
  },
  {
    albumSlug: 'holidays',
    name: 'Habesha Ceremonial Robe',
    description: 'A heritage ceremonial robe with authentic Habesha patterns for special occasions.',
    fabricDetails: 'Handwoven Cotton',
    price: 380,
    estimatedTailoringTime: '3-4 weeks',
    deliveryTime: '1-2 weeks',
    badge: 'Heritage',
    isFeatured: false,
    images: [],
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB\n');

    // Clear existing
    await Album.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing albums and products\n');

    // Insert albums
    const createdAlbums = await Album.insertMany(ALBUMS);
    console.log(`Created ${createdAlbums.length} albums:`);
    createdAlbums.forEach((a) => console.log(`  - ${a.name} (${a._id})`));

    // Build slug → _id map
    const albumMap = {};
    createdAlbums.forEach((a) => { albumMap[a.slug] = a._id; });

    // Insert products
    const productDocs = PRODUCTS.map((p) => ({
      ...p,
      albumId: albumMap[p.albumSlug],
      albumSlug: undefined, // remove helper field
    }));

    const createdProducts = await Product.insertMany(productDocs);
    console.log(`\nCreated ${createdProducts.length} products:`);
    createdProducts.forEach((p) => console.log(`  - ${p.name} ($${p.price})`));

    console.log('\n✅ Seed complete! You can now start the server and log in.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
})();
