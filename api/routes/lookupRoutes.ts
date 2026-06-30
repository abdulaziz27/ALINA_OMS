import { Router } from 'express';
import { prisma, appendAuditLog } from '../services/db.ts';

const router = Router();

// GET all lookups
router.get('/', async (req, res) => {
  try {
    const lookups = await prisma.systemLookup.findMany({
      where: { IsActive: true }
    });
    res.json({ success: true, lookups });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST to add a new lookup (e.g. new courier)
router.post('/', async (req, res) => {
  const { Category, Value, user } = req.body;
  try {
    const existing = await prisma.systemLookup.findFirst({
      where: { Category, Value }
    });
    if (existing) {
      if (!existing.IsActive) {
        await prisma.systemLookup.update({
          where: { id: existing.id },
          data: { IsActive: true }
        });
        await appendAuditLog(user?.name || 'System', user?.role || 'Admin Gudang Alina', `Reactivated ${Category}: ${Value}`, 'Settings', req.headers['user-agent']);
        return res.json({ success: true });
      }
      return res.status(400).json({ success: false, error: 'Value already exists in this category.' });
    }

    await prisma.systemLookup.create({
      data: { Category, Value }
    });
    
    await appendAuditLog(user?.name || 'System', user?.role || 'Admin Gudang Alina', `Added new ${Category}: ${Value}`, 'Settings', req.headers['user-agent']);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
