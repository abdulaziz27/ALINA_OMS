import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

export const prisma = new PrismaClient();

// Helper function for password hashing
export const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Helper for Activity Log
export const appendAuditLog = async (userName: string, role: string, activity: string, module: string, device?: string) => {
  try {
    const ts = new Date().toISOString();
    const count = await prisma.activityLog.count();
    const logId = `LOG-${String(count + 1).padStart(5, '0')}`;
    await prisma.activityLog.create({
      data: {
        Log_ID: logId,
        User_Name: userName || 'System',
        User_Role: role || 'Admin Gudang Alina',
        Activity: activity,
        Module: module,
        Timestamp: ts,
        Device: device || 'Web Browser'
      }
    });
  } catch (e) {
    console.error('Audit Log Error:', e);
  }
};
