const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medslip';

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connection Successful!');
    
    const dbName = mongoose.connection.name;
    console.log(`Connected to database: ${dbName}`);
    
    // Check for existing collections (like patients or tokens)
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Found Collections:', collections.map(c => c.name));

    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
    process.exit(1);
  }
};

testConnection();