import { Router } from 'express';
import { prisma, appendAuditLog } from '../services/db.ts';

const router = Router();

// 5. INVENTORY & TRANSACTION LOGIC
router.post('/stock-in', async (req, res) => {
  const { sku, qty, notes, user, source_type, quality_type } = req.body;
  if (!sku || !qty) return res.status(400).json({ error: 'SKU and Quantity are required' });

  const product = await prisma.product.findUnique({ where: { SKU: sku } });
  if (!product) return res.status(404).json({ error: `Product with SKU ${sku} does not exist.` });

  const isGood = quality_type !== 'Reject';
  let newStock = product.Current_Stock;

  await prisma.$transaction(async (tx) => {
    if (isGood) {
      const updated = await tx.product.update({
        where: { SKU: sku },
        data: { Current_Stock: { increment: Number(qty) } }
      });
      newStock = updated.Current_Stock;
    }

    const count = await tx.stockIn.count();
    const transactionId = `STK-IN-${String(count + 1).padStart(4, '0')}`;
    await tx.stockIn.create({
      data: {
        Transaction_ID: transactionId,
        Date: new Date().toISOString(),
        SKU: sku,
        Product_Name: product.Product_Name,
        Qty: Number(qty),
        Notes: notes || '',
        Source_Type: source_type || 'Konveksi',
        Quality_Type: quality_type || 'Good'
      }
    });
  });

  const auditMsg = `Stock In: +${qty} [${source_type || 'Konveksi'} - ${quality_type || 'Good'}] for SKU ${sku} (${product.Product_Name})`;
  await appendAuditLog(user.name, user.role, auditMsg, 'WMS');
  res.json({ success: true, currentStock: newStock });
});

router.post('/stock-out', async (req, res) => {
  const { sku, customer, qty, notes, user, destination_type, quality_type } = req.body;
  if (!sku || !qty) return res.status(400).json({ error: 'SKU and Quantity are required' });

  const product = await prisma.product.findUnique({ where: { SKU: sku } });
  if (!product) return res.status(404).json({ error: `Product with SKU ${sku} does not exist.` });

  let newStock = 0;
  await prisma.$transaction(async (tx) => {
    const updated = await tx.product.update({
      where: { SKU: sku },
      data: { Current_Stock: Math.max(0, product.Current_Stock - Number(qty)) }
    });
    newStock = updated.Current_Stock;

    const count = await tx.stockOut.count();
    const transactionId = `STK-OUT-${String(count + 1).padStart(4, '0')}`;
    await tx.stockOut.create({
      data: {
        Transaction_ID: transactionId,
        Date: new Date().toISOString(),
        SKU: sku,
        Product_Name: product.Product_Name,
        Customer: customer || 'General Out',
        Qty: Number(qty),
        Notes: notes || '',
        Destination_Type: destination_type || 'Sales',
        Quality_Type: quality_type || 'Good'
      }
    });
  });

  const auditMsg = `Stock Out: -${qty} [${destination_type || 'Sales'} - ${quality_type || 'Good'}] for SKU ${sku} (${product.Product_Name})`;
  await appendAuditLog(user.name, user.role, auditMsg, 'WMS');
  res.json({ success: true, currentStock: newStock });
});

router.post('/stock-opname', async (req, res) => {
  const { month, sku, physicalStock, user } = req.body;
  if (!month || !sku || physicalStock === undefined) {
    return res.status(400).json({ error: 'Month, SKU, and Physical Stock count are required' });
  }

  const product = await prisma.product.findUnique({ where: { SKU: sku } });
  if (!product) return res.status(404).json({ error: `Product with SKU ${sku} not found.` });

  const systemStock = product.Current_Stock || 0;
  const pCount = Number(physicalStock);
  const difference = pCount - systemStock;

  const nextOpId = `OPN-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`;
  
  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { SKU: sku },
      data: { Current_Stock: pCount }
    });
    
    await tx.stockOpname.create({
      data: {
        Opname_ID: nextOpId,
        Month: month,
        SKU: sku,
        Product_Name: product.Product_Name,
        System_Stock: systemStock,
        Physical_Stock: pCount,
        Difference: difference,
        Date: new Date().toISOString()
      }
    });
  });

  await appendAuditLog(user.name, user.role, `Stock Opname [${month}]: SKU ${sku} count as ${pCount} (Diff: ${difference >= 0 ? '+' : ''}${difference})`, 'WMS');
  res.json({ success: true, currentStock: pCount });
});

export default router;
