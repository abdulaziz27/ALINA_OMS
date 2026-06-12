const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Update function definition
code = code.replace(
  /async function appendAuditLog\(userName: string, userRole: 'OWNER' \| 'ADMIN', activity: string, module: string, userAgent\?: string, dbInstance\?: any\) \{[\s\S]*?await saveDatabaseAndSync\(db\);\n\}/,
  `function appendAuditLog(db: any, userName: string, userRole: 'OWNER' | 'ADMIN', activity: string, module: string, userAgent?: string) {
  const log = {
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

// Update all calls
code = code.replace(/appendAuditLog\(/g, 'appendAuditLog(db, ');
// Fix the definition itself which got prefixed since it's `function appendAuditLog(`
code = code.replace(/function appendAuditLog\(db, db: any, /, 'function appendAuditLog(db: any, ');
// Fix the one I already changed
code = code.replace(/appendAuditLog\(db, user\?\.name \|\| "System", user\?\.role \|\| "ADMIN", "Updated configuration", "System", undefined, db\)/, 'appendAuditLog(db, user?.name || "System", user?.role || "ADMIN", "Updated configuration", "System")');
// In logout it uses 'db' but we need to pass db. Wait, /api/auth/logout doesn't have `const db = await readAndPullDatabase();` ? Oh no.
// Let's check if logout has db.
fs.writeFileSync('server.ts', code);
console.log('Fixed');
