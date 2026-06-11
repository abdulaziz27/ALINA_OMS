const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

// 1. Add imports mapping
server = server.replace("import crypto from 'crypto';", 
`import crypto from 'crypto';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = require('./firebase-applet-config.json');
const fbApp = initializeApp(firebaseConfig);
const firestore = getFirestore(fbApp);

// Global lock to queue concurrent DB operations, fixing the race condition!
let dbLock = Promise.resolve();

// Wrapper to queue async read-modify-write loops seamlessly
function enqueueDbTask(task) {
  const next = dbLock.then(task).catch(e => console.error("DB Task Error:", e));
  dbLock = next;
  return next;
}
`);

// 2. We replace the ENTIRE section from `function readDatabase()` down to `function appendAuditLog(userName: string` 
// (which ends right before `// ----------------------------------------------------------------------` for REST API ENDPOINTS)

const startIdx = server.indexOf('function readDatabase() {');
const endMarker = '// ----------------------------------------------------------------------\n// REST API ENDPOINTS';
const endIdx = server.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find markers!");
  process.exit(1);
}

const replacementLines = `
async function readAndPullDatabase(): Promise<typeof DEFAULT_DB> {
  const docRef = doc(firestore, 'alina_db', 'main');
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as typeof DEFAULT_DB;
    }
  } catch(e) {
    console.error("Firestore read error:", e);
  }
  // Fallback to default
  await saveDatabaseAndSync(DEFAULT_DB);
  return DEFAULT_DB;
}

async function saveDatabaseAndSync(data: typeof DEFAULT_DB) {
  try {
    const docRef = doc(firestore, 'alina_db', 'main');
    await setDoc(docRef, data);
    console.log("[Sync Engine] Successfully synchronized with Firestore!");
  } catch (error) {
    console.error("Failed to write to Firestore:", error);
  }
}

// Log actions dynamically
async function appendAuditLog(userName: string, userRole: 'OWNER' | 'ADMIN', activity: string, module: string, userAgent?: string) {
  const db = await readAndPullDatabase();
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
  await saveDatabaseAndSync(db);
}

// Global hook to wrap ALL app.post endpoints to use the concurrency lock
// This ensures two users modifying products array simultaneously don't overwrite each other.
const originalPost = app.post.bind(app);
app.post = function(path, ...handlers) {
  const handler = handlers.pop();
  handlers.push(async (req, res, next) => {
    enqueueDbTask(() => new Promise(async (resolve) => {
      try {
        await handler(req, res, next);
      } finally {
        resolve();
      }
    }));
  });
  return originalPost(path, ...handlers);
}

const originalGet = app.get.bind(app);
app.get = function(path, ...handlers) {
  const handler = handlers.pop();
  handlers.push(async (req, res, next) => {
    enqueueDbTask(() => new Promise(async (resolve) => {
      try {
        await handler(req, res, next);
      } finally {
         resolve();
      }
    }));
  });
  return originalGet(path, ...handlers);
}

`;

const newServer = server.substring(0, startIdx) + replacementLines + "\n" + server.substring(endIdx);

fs.writeFileSync('server.ts', newServer);
console.log("Successfully replaced database engine with Firestore + Concurrency Queue.");
