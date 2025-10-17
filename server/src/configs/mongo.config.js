const mongoose = require('mongoose');

let isConnected = false;

async function connectMongo(uri, options = {}) {
  const mongoUri = uri || process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car_rental';

  if (isConnected) return mongoose.connection;

  // Sensible defaults, can be overridden by options
  const defaultOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    // retryWrites is true by default on Atlas; explicitly set for clarity
    retryWrites: true,
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    await mongoose.connect(mongoUri, finalOptions);
    isConnected = true;

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
    });

    return mongoose.connection;
  } catch (err) {
    // Re-throw with more context but keep original stack
    const error = new Error(`Failed to connect to MongoDB at ${mongoUri}: ${err.message}`);
    error.cause = err;
    throw error;
  }
}

async function disconnectMongo() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}

module.exports = {
  mongoose,
  connectMongo,
  disconnectMongo,
};
