import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Build MongoDB connection URI
const mongoURI = process.env.MONGODB_URI || 
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Connection options
const options = {
  maxPoolSize: 20, // Maximum number of connections in the pool
  minPoolSize: 2, // Minimum number of connections in the pool
  socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  family: 4 // Use IPv4, skip trying IPv6
};

// Connect to MongoDB
mongoose.connect(mongoURI, options)
  .then(() => console.log('✅ Connected to MongoDB database successfully'))
  .catch(err => console.error('❌ Database connection error:', err));

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

export default mongoose.connection;