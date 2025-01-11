//src/lib/db.js
const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    const uri = process.env.MONGO_URI; // Asegúrate de que esta variable esté definida en tu .env
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Salir con error si no se conecta
  }
};

module.exports = connectToDatabase;
