/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import routes from './api/routes/index.ts';
// DB sync imported removed
import { setupSwagger } from './api/swagger.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));



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



  app.listen(PORT, "localhost", () => {
    console.log(`ALINA Enterprise running at http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

