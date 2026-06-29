import { Router } from 'express';
import { prisma, appendAuditLog } from '../services/db.ts';

const router = Router();

// 4. CUSTOMER MASTER CRUD
router.post('/', async (req, res) => {
  const { action, customer, user, id } = req.body;

  if (action === 'CREATE') {
    const count = await prisma.customer.count();
    const custId = `CUST-${String(count + 1).padStart(3, '0')}`;

    const newCustomer = await prisma.customer.create({
      data: {
        Customer_ID: custId,
        Customer_Name: customer.Customer_Name,
        Customer_Type: customer.Customer_Type,
        Phone: customer.Phone || '-',
        Email: customer.Email || '-',
        Address: customer.Address || '-',
        City: customer.City || '-',
        Status: customer.Status || 'Active'
      }
    });

    await appendAuditLog(user.name, user.role, `Created customer: ${newCustomer.Customer_Name}`, 'Customer');
    return res.json({ success: true, customer: newCustomer });
  }

  if (action === 'UPDATE') {
    const existing = await prisma.customer.findUnique({ where: { Customer_ID: id } });
    if (!existing) return res.status(404).json({ error: 'Customer not found.' });

    const updated = await prisma.customer.update({
      where: { Customer_ID: id },
      data: {
        Customer_Name: customer.Customer_Name,
        Customer_Type: customer.Customer_Type,
        Phone: customer.Phone,
        Email: customer.Email,
        Address: customer.Address,
        City: customer.City,
        Status: customer.Status
      }
    });

    await appendAuditLog(user.name, user.role, `Updated customer: ${customer.Customer_Name}`, 'Customer');
    return res.json({ success: true, customer: updated });
  }

  if (action === 'DELETE') {
    const existing = await prisma.customer.findUnique({ where: { Customer_ID: id } });
    if (!existing) return res.status(404).json({ error: 'Customer not found.' });

    await prisma.customer.delete({ where: { Customer_ID: id } });
    await appendAuditLog(user.name, user.role, `Deleted customer: ${existing.Customer_Name}`, 'Customer');
    return res.json({ success: true });
  }

  res.status(400).json({ error: 'Invalid customer action' });
});

export default router;
