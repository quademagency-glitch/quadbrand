import "server-only";

import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    // Determine the credentials to use
    // In production on GCP (like Cloud Run/Vercel), you can often initialize without params
    // and it uses Application Default Credentials.
    // For local dev, you typically provide a service account JSON.
    
    const serviceAccountPath = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
    
    if (serviceAccountPath) {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else {
      // Fallback: Use application default credentials or just project ID
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
    console.log("Firebase Admin initialized.");
  } catch (error: any) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore(); // In case we need firestore, though we're using Postgres mainly
