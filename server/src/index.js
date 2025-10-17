const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectMongo } = require('./configs/mongo.config');

require('dotenv').config();

const PORT = process.env.PORT;

async function start() {
  const app = express();

  // Middlewares
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  app.use(cors({ origin: corsOrigin, credentials: true }));
  app.use(helmet());
  app.use(express.json());

  // Healthcheck route
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // API routes
  const vehicleRouter = require('./routes/vehicle.route');
  const bookingRouter = require('./routes/booking.route');
  const authRouter = require('./routes/auth.route');
  const userRouter = require('./routes/user.route');
  app.use('/api/vehicles', vehicleRouter);
  app.use('/api/bookings', bookingRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);

  // 404 handler for API
  app.use('/api', (req, res, next) => {
    if (res.headersSent) return next();
    res.status(404).json({ error: { message: 'Not found', code: 'NOT_FOUND' } });
  });

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const code = err.code || (status === 500 ? 'INTERNAL_ERROR' : 'ERROR');
    const message = err.message || 'Something went wrong';
    res.status(status).json({ error: { message, code, details: err.details || undefined } });
  });

  // Connect to MongoDB before starting server
  await connectMongo();

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\nReceived ${signal}. Shutting down...`);
    server.close(() => {
      process.exit(0);
    });
    // Fallback: force exit after timeout
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
