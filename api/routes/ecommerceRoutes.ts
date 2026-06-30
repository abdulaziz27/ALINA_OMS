import express from 'express';
import { prisma } from '../services/db';
import { requireApiKey } from '../middleware/authMiddleware';

const router = express.Router();

// Apply middleware to all routes in this router
router.use(requireApiKey);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve active product catalog
 *     description: Sync ALINA active products to e-commerce storefront. Excludes sensitive data like cost price.
 *     responses:
 *       200:
 *         description: A list of products.
 */
// 1. GET /products: Sync catalog
router.get('/products', async (req, res) => {
  try {
    // Return only active products and omit cost price for security
    const activeProducts = await prisma.product.findMany({
      where: { Status: 'Active' },
      select: {
        SKU: true,
        Product_Name: true,
        Category: true,
        Variant: true,
        Color: true,
        Size: true,
        Retail_Price: true,
        Reseller_Price: true,
        Distributor_Price: true,
        Current_Stock: true,
        QR_Code: true,
        Image_URL: true
      }
    });
      
    res.json({ success: true, count: activeProducts.length, data: activeProducts });
  } catch (error) {
    console.error('Error fetching products for ecommerce:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /stock/{sku}:
 *   get:
 *     summary: Get live stock for a specific SKU
 */
// 2. GET /stock/:sku: Flash stock check
router.get('/stock/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { SKU: sku }
    });
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ 
      success: true, 
      sku: product.SKU, 
      current_stock: product.Current_Stock 
    });
  } catch (error) {
    console.error('Error fetching stock for ecommerce:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Inject a new paid order
 */
// 3. POST /orders: Inject new paid order
router.post('/orders', async (req, res) => {
  try {
    const orderPayload = req.body;
    
    if (!orderPayload || !Array.isArray(orderPayload.items) || orderPayload.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid order payload' });
    }

    // Validate stock for all items before processing
    const products = await prisma.product.findMany({
      where: { SKU: { in: orderPayload.items.map((i: any) => i.sku) } }
    });

    const productMap = new Map(products.map((p: any) => [p.SKU, p]));

    for (const item of orderPayload.items) {
      const product = productMap.get(item.sku);
      if (!product) {
        return res.status(400).json({ success: false, error: `Product SKU ${item.sku} not found` });
      }
      if ((product as any).Current_Stock < item.qty) {
        return res.status(400).json({ success: false, error: `Insufficient stock for SKU ${item.sku}. Available: ${(product as any).Current_Stock}, Requested: ${item.qty}` });
      }
    }
    
    const now = new Date().toISOString();
    const orderNumber = orderPayload.orderNumber || `ECOMM-${Date.now()}`;

    // Use transaction to ensure data integrity
    await prisma.$transaction(async (tx) => {
      for (const item of orderPayload.items) {
        const product: any = productMap.get(item.sku);
        
        // Deduct stock
        await tx.product.update({
          where: { SKU: item.sku },
          data: { Current_Stock: { decrement: item.qty } }
        });
        
        // Calculate amount
        const amount = product.Retail_Price * item.qty;

        // Create order entry
        await tx.order.create({
          data: {
            Order_Number: orderNumber,
            Customer: orderPayload.customerName,
            SKU: item.sku,
            Qty: item.qty,
            Price: product.Retail_Price,
            Total: amount, 
            Status: 'Pending',
            Order_Date: now,
            Channel: 'Shopee', // Default channel for ecommerce
            Product: product.Product_Name,
          }
        });
      }
    });

    res.json({ 
      success: true, 
      message: 'Order successfully injected and stock deducted',
      orderNumber: orderNumber
    });
  } catch (error) {
    console.error('Error injecting order from ecommerce:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /orders/{orderNumber}/status:
 *   get:
 *     summary: Get order and shipping status
 */
// 4. GET /orders/:orderNumber/status: Order Tracking & Status
router.get('/orders/:orderNumber/status', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    
    // Find the order
    const orderItems = await prisma.order.findMany({
      where: { Order_Number: orderNumber }
    });
    
    if (orderItems.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Since items in the same order usually share the same status, just grab the first one
    const mainStatus = orderItems[0].Status;

    // Look for shipping info
    const shippingRecord = await prisma.shipping.findFirst({
      where: { Order_Number: orderNumber }
    });

    res.json({
      success: true,
      orderNumber: orderNumber,
      status: mainStatus, 
      shipping: shippingRecord ? {
        courier: shippingRecord.Courier,
        trackingNumber: shippingRecord.Tracking_Number,
        shippingStatus: shippingRecord.Status
      } : null
    });

  } catch (error) {
    console.error('Error fetching order status for ecommerce:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /products/{sku}/image:
 *   patch:
 *     summary: Update product image URL
 */
// 5. PATCH /products/:sku/image: Update product image
router.patch('/products/:sku/image', async (req, res) => {
  try {
    const { sku } = req.params;
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'imageUrl is required' });
    }

    const product = await prisma.product.findUnique({
      where: { SKU: sku }
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await prisma.product.update({
      where: { SKU: sku },
      data: { Image_URL: imageUrl }
    });

    res.json({ success: true, message: 'Image URL updated successfully' });
  } catch (error) {
    console.error('Error updating product image:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;
