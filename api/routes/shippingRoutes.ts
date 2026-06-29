import { Router } from 'express';
import { prisma, appendAuditLog } from '../services/db.ts';

const router = Router();

// 8. SHIPPING MANAGEMENT
router.post('/', async (req, res) => {
  const { action, shipping, user } = req.body;

  if (action === 'UPSERT') {
    const existing = await prisma.shipping.findFirst({ where: { Order_Number: shipping.Order_Number } });

    await prisma.$transaction(async (tx) => {
      if (existing) {
        await tx.shipping.update({
          where: { Tracking_Number: existing.Tracking_Number },
          data: {
            Tracking_Number: shipping.Tracking_Number,
            Courier: shipping.Courier,
            Shipping_Date: shipping.Shipping_Date || new Date().toISOString(),
            Status: shipping.Status || 'Waiting Pickup'
          }
        });
      } else {
        await tx.shipping.create({
          data: {
            Tracking_Number: shipping.Tracking_Number,
            Courier: shipping.Courier,
            Order_Number: shipping.Order_Number,
            Shipping_Date: shipping.Shipping_Date || new Date().toISOString(),
            Status: shipping.Status || 'Waiting Pickup'
          }
        });
      }

      if (shipping.Status === 'Delivered' || shipping.Status === 'In Transit') {
        await tx.order.updateMany({
          where: { Order_Number: shipping.Order_Number },
          data: { Status: shipping.Status === 'Delivered' ? 'Completed' : 'Shipped' }
        });
      }
    });

    await appendAuditLog(user.name, user.role, `Updated shipping record for order ${shipping.Order_Number}`, 'Shipping');
    return res.json({ success: true });
  }

  res.status(400).json({ error: 'Invalid shipping action' });
});

export default router;
