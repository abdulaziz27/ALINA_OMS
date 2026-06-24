import express from 'express';
import { readDatabase, saveDatabase } from '../services/db';
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       SKU:
 *                         type: string
 *                       Product_Name:
 *                         type: string
 *                       Category:
 *                         type: string
 *                       Variant:
 *                         type: string
 *                       Color:
 *                         type: string
 *                       Size:
 *                         type: string
 *                       Selling_Price:
 *                         type: number
 *                       Current_Stock:
 *                         type: integer
 *                       QR_Code:
 *                         type: string
 *       401:
 *         description: Unauthorized. Missing or invalid x-api-key.
 */
// 1. GET /products: Sync catalog
router.get('/products', (req, res) => {
  try {
    const db = readDatabase();
    // Return only active products and omit cost price for security
    const activeProducts = db.products
      .filter((p: any) => p.Status === 'Active')
      .map((p: any) => ({
        SKU: p.SKU,
        Product_Name: p.Product_Name,
        Category: p.Category,
        Variant: p.Variant,
        Color: p.Color,
        Size: p.Size,
        Selling_Price: p.Selling_Price,
        Current_Stock: p.Current_Stock,
        QR_Code: p.QR_Code
      }));
      
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
 *     description: Check real-time stock balance before proceeding to checkout/payment.
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: The Product SKU
 *     responses:
 *       200:
 *         description: Current stock value.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 sku:
 *                   type: string
 *                 current_stock:
 *                   type: integer
 *       404:
 *         description: Product not found.
 */
// 2. GET /stock/:sku: Flash stock check
router.get('/stock/:sku', (req, res) => {
  try {
    const { sku } = req.params;
    const db = readDatabase();
    
    const product = db.products.find((p: any) => p.SKU === sku);
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
 *     description: Push a paid order from e-commerce to ALINA OMS. This will automatically deduct stock.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - items
 *             properties:
 *               orderNumber:
 *                 type: string
 *                 description: External e-commerce order ID (optional)
 *               customerName:
 *                 type: string
 *                 description: Name of the customer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - sku
 *                     - qty
 *                   properties:
 *                     sku:
 *                       type: string
 *                     qty:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Order successfully created and stock deducted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 orderNumber:
 *                   type: string
 *       400:
 *         description: Invalid payload or insufficient stock.
 */
// 3. POST /orders: Inject new paid order
router.post('/orders', (req, res) => {
  try {
    const orderPayload = req.body;
    
    if (!orderPayload || !Array.isArray(orderPayload.items) || orderPayload.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid order payload' });
    }

    const db = readDatabase();
    
    // Validate stock for all items before processing
    for (const item of orderPayload.items) {
      const product = db.products.find((p: any) => p.SKU === item.sku);
      if (!product) {
        return res.status(400).json({ success: false, error: `Product SKU ${item.sku} not found` });
      }
      if (product.Current_Stock < item.qty) {
        return res.status(400).json({ success: false, error: `Insufficient stock for SKU ${item.sku}. Available: ${product.Current_Stock}, Requested: ${item.qty}` });
      }
    }
    
    const now = new Date().toISOString();
    const orderNumber = `ECOMM-${Date.now()}`;
    const newOrders = [];

    // Process each item and deduct stock
    for (const item of orderPayload.items) {
      const productIndex = db.products.findIndex((p: any) => p.SKU === item.sku);
      const product = db.products[productIndex];
      
      // Deduct stock
      db.products[productIndex].Current_Stock -= item.qty;
      
      // Calculate amount
      const amount = product.Selling_Price * item.qty;

      // Create order entry
      newOrders.push({
        Order_ID: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        Order_Number: orderPayload.orderNumber || orderNumber,
        Customer: orderPayload.customerName,
        SKU: item.sku,
        Qty: item.qty,
        Amount: amount,
        Status: 'Pending',
        Order_Date: now,
        // Using explicit casting since Order type requires it to be precise 
      });
    }

    // Add to orders collection
    db.orders.push(...newOrders as any);
    
    saveDatabase(db);

    res.json({ 
      success: true, 
      message: 'Order successfully injected and stock deducted',
      orderNumber: orderPayload.orderNumber || orderNumber
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
 *     description: Retrieve the fulfillment and shipping status of a specific order from ALINA OMS.
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The Order Number (e.g., ECOMM-12345 or INV-WEB-001)
 *     responses:
 *       200:
 *         description: Order status and shipping details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orderNumber:
 *                   type: string
 *                 status:
 *                   type: string
 *                 shipping:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     courier:
 *                       type: string
 *                     trackingNumber:
 *                       type: string
 *                     shippingStatus:
 *                       type: string
 *       404:
 *         description: Order not found.
 */
// 4. GET /orders/:orderNumber/status: Order Tracking & Status
router.get('/orders/:orderNumber/status', (req, res) => {
  try {
    const { orderNumber } = req.params;
    const db = readDatabase();
    
    // Find the order
    const orderItems = db.orders.filter((o: any) => o.Order_Number === orderNumber);
    if (orderItems.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Since items in the same order usually share the same status, just grab the first one
    const mainStatus = orderItems[0].Status;

    // Look for shipping info
    const shippingRecord = db.shipping.find((s: any) => s.Order_Number === orderNumber);

    res.json({
      success: true,
      orderNumber: orderNumber,
      status: mainStatus, // e.g. "New Order", "Packing", "Shipped", "Completed"
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

export default router;
