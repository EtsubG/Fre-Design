const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt < retries) {
        console.log(`Retrying in 5 seconds...`);
        await new Promise((res) => setTimeout(res, 5000));
      } else {
        console.error('All MongoDB connection attempts failed.');
        console.error('Fix your Atlas IP whitelist at https://cloud.mongodb.com → Network Access');
        console.error('Server will keep running but database operations will fail until connected.');
        // Don't exit — let the server stay up so frontend can reach it
      }
    }
  }
};

module.exports = connectDB;
