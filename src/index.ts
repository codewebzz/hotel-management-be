import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './config/database';
import { specs } from './config/swagger';
import brandRoutes from './routes/brandRoutes';
import branchRoutes from './routes/branchRoutes';
import amenityRoutes from './routes/amenityRoutes';
import companyRoutes from './routes/companyRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import roomTypeRoutes from './routes/roomTypeRoutes';
import roomTypeAmenityRoutes from './routes/roomTypeAmenityRoutes';
import roomRoutes from './routes/roomRoutes';
import pricingRoutes from './routes/pricingRoutes';
import customerRoutes from './routes/customerRoutes';
import bookingRoutes from './routes/bookingRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import staffRoutes from './routes/staffRoutes';
import housekeepingLogRoutes from './routes/housekeepingLogRoutes';
import imageRoutes from './routes/imageRoutes';

import { authenticateToken } from './middleware/auth';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Public routes (no authentication required)
app.get('/api/hello', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Hello! Welcome to the API',
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes (public - no auth required)
app.use('/api/auth', authRoutes);

// Protected routes (authentication required)
app.use('/api/brands', authenticateToken, brandRoutes);
app.use('/api/branches', authenticateToken, branchRoutes);
app.use('/api/amenities', authenticateToken, amenityRoutes);
app.use('/api/companies', authenticateToken, companyRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/room-types', authenticateToken, roomTypeRoutes);
app.use(
  '/api/room-type-amenities',
  authenticateToken,
  roomTypeAmenityRoutes
);
app.use('/api/rooms', authenticateToken, roomRoutes);
app.use('/api/pricings', authenticateToken, pricingRoutes);
app.use('/api/customers', authenticateToken, customerRoutes);
app.use('/api/bookings', authenticateToken, bookingRoutes);
app.use('/api/invoices', authenticateToken, invoiceRoutes);
app.use('/api/staff', authenticateToken, staffRoutes);
app.use('/api/housekeeping', authenticateToken, housekeepingLogRoutes);
app.use('/api/images', authenticateToken, imageRoutes);
// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Swagger documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
