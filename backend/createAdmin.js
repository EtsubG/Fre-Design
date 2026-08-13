/**
 * Run this ONCE to create the admin account:
 *   node createAdmin.js
 * Then delete this file.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const USERNAME = 'admin';
const PASSWORD = 'Admin@1234';

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const exists = await Admin.findOne({ username: USERNAME });
    if (exists) {
      console.log('Admin already exists. Nothing created.');
      process.exit(0);
    }

    await Admin.create({ username: USERNAME, password: PASSWORD });
    console.log('✅ Admin created successfully!');
    console.log(`   Username: ${USERNAME}`);
    console.log(`   Password: ${PASSWORD}`);
    console.log('\nYou can now log in to the dashboard with these credentials.');
    console.log('Delete this file after use.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
