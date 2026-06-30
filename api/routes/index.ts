import { Router } from 'express';
import ecommerceRoutes from './ecommerceRoutes.ts';
import authRoutes from './authRoutes.ts';
import dbRoutes from './dbRoutes.ts';
import productRoutes from './productRoutes.ts';
import customerRoutes from './customerRoutes.ts';
import inventoryRoutes from './inventoryRoutes.ts';
import orderRoutes from './orderRoutes.ts';
import shippingRoutes from './shippingRoutes.ts';
import userRoutes from './userRoutes.ts';
import settingsRoutes from './settingsRoutes.ts';
import lookupRoutes from './lookupRoutes.ts';

const router = Router();

// Mount API routes
router.use('/api/v1/ecommerce', ecommerceRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/db', dbRoutes);
router.use('/api/products', productRoutes);
router.use('/api/customers', customerRoutes);
router.use('/api/inventory', inventoryRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/shipping', shippingRoutes);
router.use('/api/users', userRoutes);
router.use('/api/settings', settingsRoutes);
router.use('/api/lookups', lookupRoutes);

export default router;
