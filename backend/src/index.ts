import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Example endpoint for policy simulation
app.post('/api/simulate', (req, res) => {
  const { policyType } = req.body;
  
  // Basic simulation logic (to be expanded)
  const result = {
    policyType,
    impact: {
      giniChange: -0.05,
      povertyReduction: '15%',
      cost: '$2.5T over 10 years',
      incomeBrackets: [
        { bracket: 'Bottom 20%', change: '+$12,000', amount: 12000 },
        { bracket: 'Lower Middle 20%', change: '+$8,000', amount: 8000 },
        { bracket: 'Middle 20%', change: '+$4,000', amount: 4000 },
        { bracket: 'Upper Middle 20%', change: '-$2,000', amount: -2000 },
        { bracket: 'Top 20%', change: '-$10,000', amount: -10000 },
      ]
    },
    timestamp: new Date().toISOString()
  };

  res.json(result);
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start server
const server = app.listen(Number(PORT), () => {
  console.log(`Server running in ${process.env['NODE_ENV']} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
