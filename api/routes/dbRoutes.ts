import { Router } from 'express';
import { prisma } from '../services/db.ts';

const router = Router();

// 2. RETRIEVE ALL DATABASE TABLES
router.get('/', async (req, res) => {
  const [users, products, customers, stockIn, stockOut, stockOpname, orders, shipping, activityLog] = await Promise.all([
    prisma.user.findMany(),
    prisma.product.findMany(),
    prisma.customer.findMany(),
    prisma.stockIn.findMany({ orderBy: { id: 'desc' } }),
    prisma.stockOut.findMany({ orderBy: { id: 'desc' } }),
    prisma.stockOpname.findMany({ orderBy: { id: 'desc' } }),
    prisma.order.findMany({ orderBy: { id: 'desc' } }),
    prisma.shipping.findMany(),
    prisma.activityLog.findMany({ orderBy: { id: 'desc' } })
  ]);

  const safeUsers = users.map(u => {
    const { Password_Hash, ...safe } = u;
    return { ...safe, Permissions: safe.Permissions ? JSON.parse(safe.Permissions) : [] };
  });

  res.json({
    users: safeUsers,
    products,
    customers,
    stockIn,
    stockOut,
    stockOpname,
    orders,
    shipping,
    activityLog,
    sheetsConfig: { isLinked: false, autoSync: false, scriptUrl: "", spreadsheetId: "", customLogoUrl: "" }
  });
});

export default router;
