const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecowasteconnect';
    
    console.log('🔗 Connecting to MongoDB...');
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // If MongoDB is not available, provide helpful instructions
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n📋 MongoDB Setup Instructions:');
      console.log('1. Make sure MongoDB is installed and running');
      console.log('2. For MongoDB Compass: mongodb://localhost:27017/ecowasteconnect');
      console.log('3. Or use MongoDB Atlas: Update MONGODB_URI in your .env file');
      console.log('4. Download MongoDB Community Server: https://www.mongodb.com/try/download/community');
      console.log('\n💡 To start MongoDB locally:');
      console.log('   - Windows: Run "mongod" in command prompt');
      console.log('   - Mac: Run "brew services start mongodb/brew/mongodb-community"');
      console.log('   - Linux: Run "sudo systemctl start mongod"');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
