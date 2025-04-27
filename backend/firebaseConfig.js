const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

console.log('Initializing Firebase Admin SDK...');

// There are two ways to configure Firebase Admin SDK:
// 1. Using a downloaded service account key file (more secure for development)
// 2. Using environment variables (recommended for production)

let serviceAccount;
let serviceAccountPath = path.join(__dirname, 'config', 'serviceAccountKey.json');

// Check if we're using a service account key file
try {
  // Option 1: Using a downloaded service account key file
  console.log('Checking for service account file at:', serviceAccountPath);
  
  if (fs.existsSync(serviceAccountPath)) {
    console.log('Service account file found, loading configuration...');
    serviceAccount = require(serviceAccountPath);
    console.log('Service account loaded successfully for project:', serviceAccount.project_id);
  } else {
    console.log('Service account file not found, trying environment variables...');
    // Option 2: Using environment variables
    serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID || 'paktravelapp',
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
      private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
      client_email: process.env.FIREBASE_CLIENT_EMAIL || '',
      client_id: process.env.FIREBASE_CLIENT_ID || '',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL || ''
    };
    console.log('Using environment variables for Firebase configuration with project ID:', serviceAccount.project_id);
  }
} catch (error) {
  console.error('Error loading service account:', error);
  process.exit(1);
}

// Check if we have the required Firebase configuration
if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
  console.error('Firebase configuration is missing or incomplete:');
  console.error('- Project ID:', serviceAccount.project_id ? 'Present' : 'Missing');
  console.error('- Private Key:', serviceAccount.private_key ? 'Present' : 'Missing');
  console.error('- Client Email:', serviceAccount.client_email ? 'Present' : 'Missing');
  console.error('Please check your service account key file or environment variables.');
  process.exit(1);
}

// Initialize Firebase Admin with proper error handling
let db;
try {
  console.log('Initializing Firebase Admin app...');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
  console.log('Firebase Admin SDK initialized successfully');
  
  // Initialize Firestore with error handling
  try {
    console.log('Initializing Firestore...');
    db = admin.firestore();
    console.log('Firestore initialized successfully');
    
    // Test Firestore connection
    db.collection('test').doc('connection-test').set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      message: 'Firestore connection test'
    }).then(() => {
      console.log('Firestore connection test successful');
      // Delete the test document
      return db.collection('test').doc('connection-test').delete();
    }).catch(error => {
      console.error('Firestore connection test failed:', error);
    });
  } catch (firestoreError) {
    console.error('Error initializing Firestore:', firestoreError);
    throw firestoreError;
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  process.exit(1);
}

module.exports = { admin, db }; 