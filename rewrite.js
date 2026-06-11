const fs = require('fs');

const code = `
import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = require('./firebase-applet-config.json');
const fbApp = initializeApp(firebaseConfig);
const firestore = getFirestore(fbApp);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper: read whole DB from a single Firestore document to mimic the old db.json exactly
// This avoids rewriting all the array manipulation logic.
// We use a transaction/lock via a simple memory lock (since Cloud Run mostly runs 1 instance here)
let dbLock = Promise.resolve();

async function readAndPullDatabase() {
  const docRef = doc(firestore, 'alina_db', 'main');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data();
  } else {
    // default
    const DEFAULT_DB = {
      users: [{
        User_ID: "USR-001",
        Full_Name: "Alina Owner",
        Email: "owner@alina.com",
        Password_Hash: hashPassword("HIJxF1N4"),
        Role: "OWNER",
        Status: "Active",
        Last_Login: "2026-06-08T07:40:00Z",
        Created_Date: "2026-01-01T00:00:00Z",
        Permissions: ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
      }],
      products: [],
      customers: [],
      stockIn: [],
      stockOut: [],
      stockOpname: [],
      orders: [],
      shipping: [],
      activityLog: [],
      sheetsConfig: { isLinked: false }
    };
    await setDoc(docRef, DEFAULT_DB);
    return DEFAULT_DB;
  }
}

async function saveDatabaseAndSync(data) {
  const docRef = doc(firestore, 'alina_db', 'main');
  await setDoc(docRef, data);
}

// Log actions dynamically
async function appendAuditLog(userName, userRole, activity, moduleName, userAgent) {
  const db = await readAndPullDatabase();
  const log = {
    Log_ID: "LOG-" + Date.now().toString().slice(-6) + "-" + Math.floor(Math.random() * 1000),
    User_Name: userName,
    User_Role: userRole,
    Activity: activity,
    Module: moduleName,
    Timestamp: new Date().toISOString(),
    Device: userAgent || "Web Client"
  };
  db.activityLog.unshift(log);
  if (db.activityLog.length > 500) {
    db.activityLog = db.activityLog.slice(0, 500); 
  }
  await saveDatabaseAndSync(db);
}

// Wrapper for route concurrency
function atomicRoute(handler) {
  return async (req, res) => {
    dbLock = dbLock.then(() => handler(req, res)).catch(err => {
      console.error(err);
      res.status(500).json({error: "Server Error"});
    });
  };
}

app.post('/api/auth/login', atomicRoute(async (req, res) => {
  const { email, password } = req.body;
  const db = await readAndPullDatabase();
  const user = db.users.find(u => u.Email.toLowerCase() === email.toLowerCase());
  if (!user || user.Status !== 'Active') return res.status(401).json({ error: 'Invalid user' });
  if (user.Password_Hash !== hashPassword(password)) return res.status(401).json({ error: 'Incorrect password' });
  user.Last_Login = new Date().toISOString();
  await saveDatabaseAndSync(db);
  appendAuditLog(user.Full_Name, user.Role, 'Logged in successfully', 'Security', req.headers['user-agent']);
  
  const safeUser = { ...user };
  delete safeUser.Password_Hash;
  return res.json({ user: safeUser });
}));

app.post('/api/auth/logout', atomicRoute(async (req, res) => {
  res.json({ success: true });
}));

app.get('/api/db', atomicRoute(async (req, res) => {
  const db = await readAndPullDatabase();
  const safeUsers = db.users.map(u => {
    const { Password_Hash, ...safe } = u;
    return safe;
  });
  res.json({ ...db, users: safeUsers });
}));

// We'll dynamically parse and insert the original server file's endpoints here!
`;

fs.writeFileSync('rewrite.js', code);
console.log('Done');
