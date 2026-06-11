const fs = require('fs');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const fbApp = initializeApp(firebaseConfig);
const firestore = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

async function run() {
    const docRef = doc(firestore, 'alina_db', 'main');
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
        console.log("No DB exists");
        return;
    }
    const db = snap.data();
    
    // update User 1
    const u1 = db.users.find(u => u.User_ID === 'USR-001');
    if (u1) {
        u1.Email = "Owner@alina.com";
        u1.Password_Hash = hashPassword("HIJxF1N4");
    }

    // update User 2
    const u2 = db.users.find(u => u.User_ID === 'USR-002');
    if (u2) {
        u2.Email = "admin@alina.com";
        u2.Password_Hash = hashPassword("4L1N4xAdmin");
    }

    await setDoc(docRef, db);
    console.log("Updated users in firestore");
    process.exit(0);
}

run().catch(console.error);
