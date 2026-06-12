const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace all `appendAuditLog(` with `appendAuditLog(db, `
code = code.replace(/appendAuditLog\(/g, 'appendAuditLog(db, ');

// Fix the function declaration
code = code.replace(/async function appendAuditLog\(db, userName: string/, 'function appendAuditLog(db: any, userName: string');

// Remove `await` from `await appendAuditLog` because we made it synchronous
code = code.replace(/await appendAuditLog/g, 'appendAuditLog');

// Fix logout to load db
code = code.replace(/app\.post\('\/api\/auth\/logout', async \(req, res\) => \{\n  const \{ userName, role \} = req\.body;\n  if \(userName\) \{\n    appendAuditLog\(db, userName, role \|\| 'ADMIN', `Logged out`, 'Security', req\.headers\['user-agent'\]\);\n  \}/, 
`app.post('/api/auth/logout', async (req, res) => {
  const { userName, role } = req.body;
  if (userName) {
    const db = await readAndPullDatabase();
    appendAuditLog(db, userName, role || 'ADMIN', \`Logged out\`, 'Security', req.headers['user-agent'] as string);
    await saveDatabaseAndSync(db);
  }`);

// Fix the appendAuditLog implementation to not fetch db or save!
code = code.replace(
  /function appendAuditLog\(db: any, userName: string, userRole: 'OWNER' \| 'ADMIN', activity: string, module: string, userAgent\?: string, dbInstance\?: any\) \{[\s\S]*?await saveDatabaseAndSync\(db\);\n\}/,
`function appendAuditLog(db: any, userName: string, userRole: 'OWNER' | 'ADMIN', activity: string, module: string, userAgent?: string) {
  const log: ActivityLog = {
    Log_ID: \`LOG-\${Date.now().toString().slice(-6)}-\${Math.floor(Math.random() * 1000)}\`,
    User_Name: userName,
    User_Role: userRole,
    Activity: activity,
    Module: module,
    Timestamp: new Date().toISOString(),
    Device: userAgent || "Web Client"
  };
  db.activityLog.unshift(log);
  if (db.activityLog.length > 500) {
    db.activityLog = db.activityLog.slice(0, 500); // keep it lean
  }
}`
);

// Fix the one I manually changed
code = code.replace(/appendAuditLog\(db, user\?\.name \|\| "System", user\?\.role \|\| "ADMIN", "Updated configuration", "System", undefined, db\)/, 'appendAuditLog(db, user?.name || "System", user?.role || "ADMIN", "Updated configuration", "System")');

// Replace any occurrences of `appendAuditLog(db, db, ` due to running replace twice
code = code.replace(/appendAuditLog\(db, db, /g, 'appendAuditLog(db, ');

fs.writeFileSync('server.ts', code);
console.log('Fixed exactly!');
