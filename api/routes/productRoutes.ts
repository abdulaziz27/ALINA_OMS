import { Router } from 'express';
import { prisma, appendAuditLog } from '../services/db.ts';

const router = Router();

// 3. PRODUCT MASTER CRUD
router.post('/', async (req, res) => {
  const { action, product, user, id } = req.body;

  if (action === 'CREATE') {
    const count = await prisma.product.count();
    const prodId = `PROD-${String(count + 1).padStart(3, '0')}`;
    
    const exists = await prisma.product.findUnique({ where: { SKU: product.SKU } });
    if (exists) {
      return res.status(400).json({ error: 'SKU is already registered and must be unique.' });
    }

    const newProduct = await prisma.product.create({
      data: {
        Product_ID: prodId,
        SKU: product.SKU,
        Barcode: product.Barcode || product.SKU,
        QR_Code: product.QR_Code || product.SKU,
        Product_Name: product.Product_Name,
        Image_URL: product.Image_URL || null,
        Category: product.Category,
        Variant: product.Variant,
        Color: product.Color,
        Size: product.Size,
        Cost_Price: Number(product.Cost_Price),
        Retail_Price: Number(product.Retail_Price),
        Reseller_Price: Number(product.Reseller_Price),
        Distributor_Price: Number(product.Distributor_Price),
        Current_Stock: Number(product.Current_Stock) || 0,
        Minimum_Stock: Number(product.Minimum_Stock) || 0,
        Status: product.Status || 'Active'
      }
    });

    await appendAuditLog(user.name, user.role, `Created product SKU: ${newProduct.SKU}`, 'Product');
    return res.json({ success: true, product: newProduct });
  }

  if (action === 'UPDATE') {
    const existing = await prisma.product.findUnique({ where: { Product_ID: id } });
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (product.SKU !== existing.SKU) {
      const skuCheck = await prisma.product.findUnique({ where: { SKU: product.SKU } });
      if (skuCheck) return res.status(400).json({ error: 'Target SKU already exists, cannot rename.' });
    }

    const updated = await prisma.product.update({
      where: { Product_ID: id },
      data: {
        SKU: product.SKU,
        Barcode: product.Barcode || product.SKU,
        QR_Code: product.QR_Code || product.SKU,
        Product_Name: product.Product_Name,
        Category: product.Category,
        Variant: product.Variant,
        Color: product.Color,
        Size: product.Size,
        Cost_Price: Number(product.Cost_Price),
        Retail_Price: Number(product.Retail_Price),
        Reseller_Price: Number(product.Reseller_Price),
        Distributor_Price: Number(product.Distributor_Price),
        Current_Stock: Number(product.Current_Stock),
        Minimum_Stock: Number(product.Minimum_Stock),
        Status: product.Status
      }
    });

    await appendAuditLog(user.name, user.role, `Updated product SKU: ${product.SKU}`, 'Product');
    return res.json({ success: true, product: updated });
  }

  if (action === 'DELETE') {
    if (user.role !== 'Owner Alina') {
      return res.status(403).json({ error: 'Access denied: Only OWNER can delete products.' });
    }
    const existing = await prisma.product.findUnique({ where: { Product_ID: id } });
    if (!existing) return res.status(404).json({ error: 'Product not found.' });
    
    await prisma.product.delete({ where: { Product_ID: id } });
    await appendAuditLog(user.name, user.role, `Deleted product SKU: ${existing.SKU}`, 'Product');
    return res.json({ success: true });
  }

  res.status(400).json({ error: 'Invalid action parameter' });
});

router.post('/import', async (req, res) => {
  const { products, user } = req.body;
  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ error: 'Invalid or empty products array for import' });
  }

  let created = 0;
  let updated = 0;
  const count = await prisma.product.count();
  let nextIdNum = count + 1;

  for (const p of products) {
    if (!p.SKU || !p.Product_Name) continue;

    const existing = await prisma.product.findUnique({ where: { SKU: p.SKU } });
    
    if (existing) {
      await prisma.product.update({
        where: { SKU: p.SKU },
        data: {
          Product_Name: p.Product_Name,
          Category: p.Category || existing.Category,
          Variant: p.Variant || existing.Variant,
          Color: p.Color || existing.Color,
          Size: p.Size || existing.Size,
          Cost_Price: p.Cost_Price !== undefined ? Number(p.Cost_Price) : existing.Cost_Price,
          Retail_Price: p.Retail_Price !== undefined ? Number(p.Retail_Price) : existing.Retail_Price,
          Reseller_Price: p.Reseller_Price !== undefined ? Number(p.Reseller_Price) : existing.Reseller_Price,
          Distributor_Price: p.Distributor_Price !== undefined ? Number(p.Distributor_Price) : existing.Distributor_Price,
          Current_Stock: p.Current_Stock !== undefined ? Number(p.Current_Stock) : existing.Current_Stock,
          Minimum_Stock: p.Minimum_Stock !== undefined ? Number(p.Minimum_Stock) : existing.Minimum_Stock,
          Status: p.Status || existing.Status
        }
      });
      updated++;
    } else {
      const prodId = `PROD-${String(nextIdNum++).padStart(3, '0')}`;
      await prisma.product.create({
        data: {
          Product_ID: prodId,
          SKU: p.SKU,
          Barcode: p.SKU,
          QR_Code: p.SKU,
          Product_Name: p.Product_Name,
          Category: p.Category,
          Variant: p.Variant,
          Color: p.Color,
          Size: p.Size,
          Cost_Price: Number(p.Cost_Price) || 0,
          Retail_Price: Number(p.Retail_Price) || 0,
          Reseller_Price: Number(p.Reseller_Price) || 0,
          Distributor_Price: Number(p.Distributor_Price) || 0,
          Current_Stock: Number(p.Current_Stock) || 0,
          Minimum_Stock: Number(p.Minimum_Stock) || 0,
          Status: 'Active'
        }
      });
      created++;
    }
  }

  await appendAuditLog(user.name, user.role, `Imported products: ${created} created, ${updated} updated`, 'Product');
  res.json({ success: true, created, updated });
});

export default router;
