import { Router } from 'express';
import { prisma, appendAuditLog } from '../services/db.ts';
import { OrderStatus } from '../../src/types.ts';

const router = Router();

// 7. ORDER MANAGEMENT SYSTEM
router.post('/', async (req, res) => {
  const { action, order, user, orderNumber } = req.body;

  if (action === 'CREATE') {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await prisma.order.count({ where: { Order_Number: { startsWith: `ORD-${dateStr}` } } });
    const ordNum = `ORD-${dateStr}-${String(count + 1).padStart(4, '0')}`;

    let firstOrder: any = null;
    let items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [order];

    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const productSku = item.SKU;
        const productItem = await tx.product.findUnique({ where: { SKU: productSku } });
        if (!productItem) throw new Error(`Product with SKU ${productSku} not found.`);

        const qtyVal = Number(item.Qty);
        const priceVal = Number(item.Price || productItem.Selling_Price);
        const totalVal = qtyVal * priceVal;
        const status = order.Status || 'New Order';

        const newOrder = await tx.order.create({
          data: {
            Order_Number: ordNum,
            Order_Date: new Date().toISOString(),
            Customer: order.Customer,
            Channel: order.Channel,
            SKU: productSku,
            Product: productItem.Product_Name,
            Qty: qtyVal,
            Price: priceVal,
            Total: totalVal,
            Status: status
          }
        });

        if (!firstOrder) firstOrder = newOrder;

        if (['New Order', 'Processing', 'Picking', 'Packing', 'Ready To Ship', 'Shipped', 'Completed'].includes(status)) {
          await tx.product.update({
            where: { SKU: productSku },
            data: { Current_Stock: Math.max(0, productItem.Current_Stock - qtyVal) }
          });
        }
      }

      if (firstOrder && (firstOrder.Status === 'Shipped' || firstOrder.Status === 'Ready To Ship')) {
        const shipNum = `TRK-${Date.now().toString().slice(-6)}`;
        await tx.shipping.create({
          data: {
            Tracking_Number: shipNum,
            Courier: 'JNE Express',
            Order_Number: ordNum,
            Shipping_Date: new Date().toISOString(),
            Status: firstOrder.Status === 'Shipped' ? 'In Transit' : 'Waiting Pickup'
          }
        });
      }
    });

    await appendAuditLog(user.name, user.role, `Created sales order ${ordNum}`, 'OMS');
    return res.json({ success: true, order: firstOrder });
  }

  if (action === 'UPDATE_STATUS') {
    const matchedOrders = await prisma.order.findMany({ where: { Order_Number: orderNumber } });
    if (!matchedOrders.length) return res.status(404).json({ error: 'Order not found.' });

    const newStatus = order.Status as OrderStatus;
    const oldStatus = matchedOrders[0].Status;
    const wasStockDecremented = !['Draft', 'Cancelled'].includes(oldStatus);
    const isStockNowDecremented = !['Draft', 'Cancelled'].includes(newStatus);

    await prisma.$transaction(async (tx) => {
      for (const o of matchedOrders) {
        if (wasStockDecremented && !isStockNowDecremented) {
          await tx.product.update({
            where: { SKU: o.SKU },
            data: { Current_Stock: { increment: o.Qty } }
          });
        } else if (!wasStockDecremented && isStockNowDecremented) {
          const p = await tx.product.findUnique({ where: { SKU: o.SKU } });
          if (p) {
            await tx.product.update({
              where: { SKU: o.SKU },
              data: { Current_Stock: Math.max(0, p.Current_Stock - o.Qty) }
            });
          }
        }
        await tx.order.update({
          where: { id: o.id },
          data: { Status: newStatus }
        });
      }

      if (newStatus === 'Shipped') {
        const shipExists = await tx.shipping.findFirst({ where: { Order_Number: orderNumber } });
        if (!shipExists) {
          await tx.shipping.create({
            data: {
              Tracking_Number: `TRK-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*10)}`,
              Courier: order.Courier || 'Wahana',
              Order_Number: orderNumber,
              Shipping_Date: new Date().toISOString(),
              Status: 'In Transit'
            }
          });
        } else {
          await tx.shipping.update({
            where: { Tracking_Number: shipExists.Tracking_Number },
            data: { Status: 'In Transit', Courier: order.Courier || shipExists.Courier, Tracking_Number: order.Tracking_Number || shipExists.Tracking_Number }
          });
        }
      }
    });

    if (newStatus === 'Packing') {
      await appendAuditLog(user.name, user.role, `Verified checklist and packed order: ${orderNumber}`, 'OMS');
    }
    await appendAuditLog(user.name, user.role, `Changed status of Order ${orderNumber} from "${oldStatus}" to "${newStatus}"`, 'OMS');
    return res.json({ success: true });
  }

  if (action === 'DELETE') {
    const deleted = await prisma.order.deleteMany({ where: { Order_Number: orderNumber } });
    if (deleted.count === 0) return res.status(404).json({ error: 'Order not found.' });
    
    await appendAuditLog(user.name, user.role, `Deleted Order ${orderNumber}`, 'OMS');
    return res.json({ success: true });
  }

  res.status(400).json({ error: 'Invalid order action' });
});

export default router;
