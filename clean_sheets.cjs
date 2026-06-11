const fs = require('fs');

// Backend:
let server = fs.readFileSync('server.ts', 'utf8');

// Replace middleware
server = server.replace(/app\.use\(async \(req, res, next\) => \{[\s\S]*?next\(\);\n\}\);/, "app.use(async (req, res, next) => { next(); });");

// Replace sheets-config
const sheetsConfigRegex = /app\.post\('\/api\/settings\/sheets-config'[\s\S]*?res\.json\(\{ success: true, config: db\.sheetsConfig \}\);\n\}\);/;
server = server.replace(sheetsConfigRegex, 
`app.post('/api/settings/sheets-config', async (req, res) => {
  const { customLogoUrl, user } = req.body;
  const db = await readAndPullDatabase();
  db.sheetsConfig = { ...db.sheetsConfig, customLogoUrl: customLogoUrl || "" };
  await saveDatabaseAndSync(db);
  appendAuditLog(user?.name || "System", user?.role || "ADMIN", "Updated configuration", "System");
  res.json({ success: true, config: db.sheetsConfig });
});`);

// Replace sync-now
const syncNowRegex = /app\.post\('\/api\/settings\/sync-now'[\s\S]*?\}\);/;
server = server.replace(syncNowRegex, 
`app.post('/api/settings/sync-now', async (req, res) => {
  res.json({ success: true, message: "Sinkronisasi berhasil dengan Firestore!" });
});`);

// Remove setInterval
server = server.replace(/setInterval\(async \(\) => \{[\s\S]*?\}, 10000\);/g, "");

fs.writeFileSync('server.ts', server);

// Frontend:
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');
const sheetsCardRegex = /<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">[\s\S]*?<h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">.*?Google Sheets[\s\S]*?<\/form>[\s\S]*?<\/div>/;
appTsx = appTsx.replace(sheetsCardRegex, ""); // removes google sheets card in settings
fs.writeFileSync('src/App.tsx', appTsx);

console.log('Cleaned up sheets sync!');
