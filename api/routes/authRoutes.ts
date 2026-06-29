import { Router } from 'express';
import { prisma, hashPassword, appendAuditLog } from '../services/db.ts';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and Password are required' });
  }

  const users = await prisma.user.findMany();
  const user = users.find(u => u.Email.toLowerCase() === email.toLowerCase());

  if (!user || user.Status !== 'Active') {
    return res.status(401).json({ error: 'Invalid active user credentials' });
  }

  const testHash = hashPassword(password);
  if (user.Password_Hash !== testHash) {
    return res.status(401).json({ error: 'Incorrect email or password' });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { Last_Login: new Date().toISOString() }
  });

  await appendAuditLog(user.Full_Name, user.Role, `Logged in successfully`, 'Security', req.headers['user-agent']);

  return res.json({
    user: {
      User_ID: user.User_ID,
      Full_Name: user.Full_Name,
      Email: user.Email,
      Role: user.Role,
      Status: user.Status,
      Last_Login: new Date().toISOString(),
      Permissions: user.Permissions ? JSON.parse(user.Permissions) : []
    }
  });
});

router.post('/logout', async (req, res) => {
  const { userName, role } = req.body;
  if (userName) {
    await appendAuditLog(userName, role || 'ADMIN', `Logged out`, 'Security', req.headers['user-agent']);
  }
  res.json({ success: true });
});

export default router;
