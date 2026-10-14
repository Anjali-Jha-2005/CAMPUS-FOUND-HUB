const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const { swaggerUi, specs } = require('./utils/swagger');
const { connectRedis } = require('./services/redisService');
const errorHandler = require('./middlewares/errorMiddleware');

// Route files
const auth = require('./routes/authRoutes');
const items = require('./routes/itemRoutes');
const claims = require('./routes/claimRoutes');

// Load env vars
dotenv.config();

// Connect to database removed from here, now in startServer
// connectDB();

// Connect to Redis removed from here, now in startServer
// connectRedis();

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5174"
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Body parser
app.use(express.json());
app.use(mongoSanitize()); // Prevent NoSQL injection

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security Middlewares
app.use(helmet()); // Set security headers
app.use(cors({
  origin: allowedOrigins,
  credentials: true
})); // Enable CORS with multiple origins
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Basic Route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to Campus Found Hub API' });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/items', items);
app.use('/api/v1/claims', claims);

// Error handler middleware
app.use(errorHandler);

// Socket.IO setup
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Connect to Redis
    await connectRedis();

    server.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
