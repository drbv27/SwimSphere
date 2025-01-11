// src/lib/db.js
import mongoose from 'mongoose';

/**
 * Connect to MongoDB.
 * - Uses cached connection for efficiency in development.
 */
const connectToDatabase = async () => {
  if (mongoose.connection.readyState) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI is not defined in .env.local');

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectToDatabase;

