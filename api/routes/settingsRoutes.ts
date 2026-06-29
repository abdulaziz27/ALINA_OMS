import { Router } from 'express';

const router = Router();

// 9. CONFIGURATION & SHEET SYNCHRONIZATION (MOCK)
router.post('/sheets-config', async (req, res) => {
  res.json({ success: true, config: { isLinked: false, autoSync: false, scriptUrl: "", spreadsheetId: "", customLogoUrl: "" } });
});

router.post('/sync-now', async (req, res) => {
  res.json({ success: true, message: "Database SQL lokal berhasil disimpan. Sinkronisasi Google Sheets telah dinonaktifkan." });
});

export default router;
