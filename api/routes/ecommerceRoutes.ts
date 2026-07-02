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
// 1. GET /products: Sinkronisasi katalog
router.get('/products', async (req, res) => {
  try {
    // Kembalikan hanya produk aktif dan sembunyikan harga modal untuk keamanan
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
        Marketer_Price: true,
        Reseller_Price: true,
        Agen_Price: true,
        Distributor_Price: true,
        Current_Stock: true,
        QR_Code: true,
        Image_URL: true
      }
    });
      
    res.json({ success: true, count: activeProducts.length, data: activeProducts });
  } catch (error) {
    console.error('Gagal mengambil produk untuk e-commerce:', error);
    res.status(500).json({ success: false, error: 'Terjadi Kesalahan Internal Server' });
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
      return res.status(404).json({ success: false, error: 'Produk tidak ditemukan' });
    }

    res.json({ 
      success: true, 
      sku: product.SKU, 
      current_stock: product.Current_Stock 
    });
  } catch (error) {
    console.error('Gagal mengambil stok untuk e-commerce:', error);
    res.status(500).json({ success: false, error: 'Terjadi Kesalahan Internal Server' });
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Masukkan pesanan baru yang sudah dibayar
 */
// 3. POST /orders: Inject new paid order
router.post('/orders', async (req, res) => {
  try {
    const orderPayload = req.body;
    
    if (!orderPayload || !Array.isArray(orderPayload.items) || orderPayload.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Data pesanan tidak valid' });
    }

    // Validasi stok untuk semua barang sebelum diproses
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

    // PENGECEKAN IDEMPOTENSI: Jika pesanan sudah ada, kembalikan status sukses untuk mencegah pemotongan ganda saat dicoba ulang
    if (orderPayload.orderNumber) {
      const existingOrder = await prisma.order.findFirst({
        where: { Order_Number: orderPayload.orderNumber }
      });
      if (existingOrder) {
        return res.json({ 
          success: true, 
          message: 'Pesanan sudah diproses (Respon Idempoten)',
          orderNumber: orderPayload.orderNumber
        });
      }
    }

    // Gunakan transaksi untuk memastikan integritas data
    await prisma.$transaction(async (tx) => {
      for (const item of orderPayload.items) {
        const product: any = productMap.get(item.sku);
        
        // Potong stok
        await tx.product.update({
          where: { SKU: item.sku },
          data: { Current_Stock: { decrement: item.qty } }
        });
        
        // Hitung jumlah
        const amount = product.Retail_Price * item.qty;

        // Buat entri pesanan
        await tx.order.create({
          data: {
            Order_Number: orderNumber,
            Customer: orderPayload.customerName,
            SKU: item.sku,
            Qty: item.qty,
            Price: product.Retail_Price,
            Total: amount, 
            Status: 'Ready To Ship', // Langsung ke status siap kirim jika berasal dari E-commerce
            Order_Date: now,
            Channel: orderPayload.channel || 'E-Commerce', 
            Product: product.Product_Name,
          }
        });
      }

      // Jika E-commerce mengirimkan info pengiriman Biteship, segera buat rekam pengiriman
      if (orderPayload.shippingCourier && orderPayload.trackingNumber) {
        await tx.shipping.create({
          data: {
            Tracking_Number: orderPayload.trackingNumber,
            Courier: orderPayload.shippingCourier,
            Order_Number: orderNumber,
            Shipping_Date: now,
            Status: 'Ready To Ship'
          }
        });
      }
    });

    res.json({ 
      success: true, 
      message: 'Pesanan berhasil dimasukkan dan stok telah dipotong',
      orderNumber: orderNumber
    });
  } catch (error) {
    console.error('Gagal memasukkan pesanan dari e-commerce:', error);
    res.status(500).json({ success: false, error: 'Terjadi Kesalahan Internal Server' });
  }
});

/**
 * @swagger
 * /orders/{orderNumber}/status:
 *   get:
 *     summary: Ambil status pesanan dan pengiriman
 */
// 4. GET /orders/:orderNumber/status: Order Tracking & Status
router.get('/orders/:orderNumber/status', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    
    // Cari pesanan
    const orderItems = await prisma.order.findMany({
      where: { Order_Number: orderNumber }
    });
    
    if (orderItems.length === 0) {
      return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan' });
    }

    // Karena barang dalam pesanan yang sama biasanya memiliki status yang sama, ambil yang pertama saja
    const mainStatus = orderItems[0].Status;

    // Cari info pengiriman
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
    console.error('Gagal mengambil status pesanan untuk e-commerce:', error);
    res.status(500).json({ success: false, error: 'Terjadi Kesalahan Internal Server' });
  }
});

/**
 * @swagger
 * /products/{sku}/image:
 *   patch:
 *     summary: Perbarui URL gambar produk
 */
// 5. PATCH /products/:sku/image: Update product image
router.patch('/products/:sku/image', async (req, res) => {
  try {
    const { sku } = req.params;
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'imageUrl wajib diisi' });
    }

    const product = await prisma.product.findUnique({
      where: { SKU: sku }
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Produk tidak ditemukan' });
    }

    await prisma.product.update({
      where: { SKU: sku },
      data: { Image_URL: imageUrl }
    });

    res.json({ success: true, message: 'URL Gambar berhasil diperbarui' });
  } catch (error) {
    console.error('Gagal memperbarui gambar produk:', error);
    res.status(500).json({ success: false, error: 'Terjadi Kesalahan Internal Server' });
  }
});

/**
 * @swagger
 * /orders/{orderNumber}/cancel:
 *   post:
 *     summary: Batalkan pesanan dan kembalikan stok
 *     description: Digunakan oleh e-commerce ketika pelanggan gagal membayar atau membatalkan pesanan.
 */
// 6. POST /orders/:orderNumber/cancel: Batalkan pesanan & kembalikan stok
router.post('/orders/:orderNumber/cancel', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    
    // Cari semua barang di dalam pesanan
    const orderItems = await prisma.order.findMany({
      where: { Order_Number: orderNumber }
    });
    
    if (orderItems.length === 0) {
      return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan' });
    }

    // Pengecekan pembatalan idempoten
    if (orderItems[0].Status === 'Cancelled') {
      return res.json({ 
        success: true, 
        message: 'Pesanan sudah dibatalkan (Respon Idempoten)',
        orderNumber 
      });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Kembalikan stok
      for (const item of orderItems) {
        await tx.product.update({
          where: { SKU: item.SKU },
          data: { Current_Stock: { increment: item.Qty } }
        });
      }

      // 2. Ubah Status Pesanan menjadi Dibatalkan
      await tx.order.updateMany({
        where: { Order_Number: orderNumber },
        data: { Status: 'Cancelled' }
      });

      // 3. Ubah Status Pengiriman menjadi Dibatalkan (jika ada)
      await tx.shipping.updateMany({
        where: { Order_Number: orderNumber },
        data: { Status: 'Cancelled' }
      });
    });

    res.json({ 
      success: true, 
      message: 'Pesanan berhasil dibatalkan dan stok telah dikembalikan',
      orderNumber 
    });
  } catch (error) {
    console.error('Gagal membatalkan pesanan:', error);
    res.status(500).json({ success: false, error: 'Terjadi Kesalahan Internal Server' });
  }
});

export default router;
