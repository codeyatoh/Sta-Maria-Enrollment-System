import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
} catch (e) {
  console.error("Could not read service account key at", serviceAccountPath);
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function run() {
  try {
    console.log("Fetching users...");
    const usersSnap = await db.collection('users').get();
    let angelitoId = null;
    usersSnap.forEach(doc => {
      const data = doc.data();
      if (data.firstName === 'Angelito' && data.lastName === 'Halmain') {
        angelitoId = doc.id;
        console.log(`Found Angelito Halmain: ${doc.id}`);
      }
    });

    if (!angelitoId) {
      console.log("Could not find Angelito Halmain in the database.");
    }

    console.log("\nFetching assignments...");
    const assignSnap = await db.collection('assignments').get();
    assignSnap.forEach(doc => {
      const data = doc.data();
      console.log(`Assignment ${doc.id}: Teacher ${data.teacherId}, Section ${data.sectionId}, Classroom ${data.classroomId}`);
      if (angelitoId && data.teacherId === angelitoId) {
        console.log(`>>> MATCH FOR ANGELITO! Assignment ID: ${doc.id}`);
      }
    });

    console.log("\nFetching sections...");
    const sectionSnap = await db.collection('sections').get();
    const sectionIds = new Set();
    sectionSnap.forEach(doc => {
      sectionIds.add(doc.id);
      console.log(`Section ${doc.id}: ${doc.data().name} in classroom ${doc.data().classroomId}`);
    });

    console.log("\nChecking for orphaned assignments...");
    assignSnap.forEach(doc => {
      const data = doc.data();
      if (!sectionIds.has(data.sectionId)) {
        console.log(`Orphaned Assignment found! ID: ${doc.id} - Section ${data.sectionId} no longer exists.`);
      }
    });

  } catch (err) {
    console.error("Error:", err);
  }
}

run();
