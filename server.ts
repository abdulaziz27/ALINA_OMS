/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import routes from './api/routes/index.ts';
import { readDatabase, DB_FILE, pullFromGoogleSheets, IS_VERCEL } from './api/services/db.ts';
import { setupSwagger } from './api/swagger.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Vercel / Cloud Run Serverless Database Hydration Middleware
app.use((req, res, next) => {
  if (req.headers['x-sheets-config']) {
    try {
      const cfg = JSON.parse(req.headers['x-sheets-config'] as string);
      if (cfg && cfg.scriptUrl) {
         const db = readDatabase();
         if (!db.sheetsConfig || db.sheetsConfig.scriptUrl !== cfg.scriptUrl) {
           db.sheetsConfig = cfg;
           fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
         }
      }
    } catch(e) {
      console.warn("Failed to parse x-sheets-config header", e);
    }
  }
  next();
});

// API Routes
app.use('/', routes);

// Swagger Documentation
setupSwagger(app);

// ----------------------------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// ----------------------------------------------------------------------

async function startServer() {
  // Jika berjalan pada ekosistem Vercel Serverless, biarkan router Vercel melayani static files,
  // Express hanya berperan sebagai API gateway mikro tanpa memblokir port (prevent port listen)
  if (process.env.VERCEL) {
    console.log("ALINA running in Vercel Serverless environment.");
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Periodic background Google Sheets auto-pull synchronization daemon
  setInterval(async () => {
    try {
      const db = readDatabase();
      if (db.sheetsConfig && db.sheetsConfig.isLinked && db.sheetsConfig.autoSync && db.sheetsConfig.scriptUrl) {
        console.log("[Background Sync Engine] Checking and pulling latest updates from Google Sheets in background...");
        await pullFromGoogleSheets(db);
      }
    } catch (err) {
      console.error("[Background Sync Engine] Error in automatic background pull:", err);
    }
  }, 10000); // pull every 10 seconds

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ALINA Enterprise running at http://0.0.0.0:${PORT}`);
  });
}

if (!IS_VERCEL) {
  startServer();
}

export default app;

