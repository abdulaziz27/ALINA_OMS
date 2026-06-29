import { Router } from 'express';
import { prisma, hashPassword, appendAuditLog } from '../services/db.ts';

const router = Router();

// 10. USER MANAGEMENT (OWNER ONLY)
router.post('/', async (req, res) => {
  const { action, targetUser, user, id } = req.body;

  if (user.role !== 'OWNER') {
    return res.status(403).json({ error: 'Access denied: Only OWNER can manage users.' });
  }

  if (action === 'CREATE') {
    const count = await prisma.user.count();
    const uid = `USR-${String(count + 1).padStart(3, '0')}`;
    
    const exists = await prisma.user.findFirst({ where: { Email: targetUser.Email } });
    if (exists) return res.status(400).json({ error: 'Email already exists.' });

    const newUser = await prisma.user.create({
      data: {
        User_ID: uid,
        Full_Name: targetUser.Full_Name,
        Email: targetUser.Email,
        Password_Hash: hashPassword(targetUser.Password || "alina123"),
        Role: targetUser.Role || 'ADMIN',
        Status: targetUser.Status || 'Active',
        Last_Login: '',
        Created_Date: new Date().toISOString(),
        Permissions: targetUser.Permissions ? JSON.stringify(targetUser.Permissions) : JSON.stringify(["dashboard", "products"])
      }
    });

    await appendAuditLog(user.name, user.role, `Created User: ${newUser.Full_Name}`, 'Security');
    return res.json({ success: true, user: newUser });
  }

  if (action === 'UPDATE') {
    const existing = await prisma.user.findUnique({ where: { User_ID: id } });
    if (!existing) return res.status(404).json({ error: 'User not found.' });

    const updated = await prisma.user.update({
      where: { User_ID: id },
      data: {
        Full_Name: targetUser.Full_Name,
        Email: targetUser.Email,
        Role: targetUser.Role,
        Status: targetUser.Status,
        Password_Hash: targetUser.Password ? hashPassword(targetUser.Password) : existing.Password_Hash,
        Permissions: targetUser.Permissions ? JSON.stringify(targetUser.Permissions) : existing.Permissions
      }
    });

    await appendAuditLog(user.name, user.role, `Updated User details for: ${targetUser.Full_Name}`, 'Security');
    return res.json({ success: true });
  }

  if (action === 'DELETE') {
    if (id === 'USR-001') return res.status(400).json({ error: 'Cannot delete default primary owner account' });
    
    const existing = await prisma.user.findUnique({ where: { User_ID: id } });
    if (!existing) return res.status(404).json({ error: 'User not found.' });

    await prisma.user.delete({ where: { User_ID: id } });
    await appendAuditLog(user.name, user.role, `Deleted User: ${existing.Full_Name}`, 'Security');
    return res.json({ success: true });
  }

  res.status(400).json({ error: 'Invalid user action' });
});

export default router;
