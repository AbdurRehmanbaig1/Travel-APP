# Firebase Setup Instructions for Travel Agency Management System

This document provides detailed steps for setting up Firebase for both the backend and frontend of the Travel Agency Management System.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps to create a new project named "PakTravelApp"
3. Once the project is created, you'll be taken to the project dashboard

## 2. Setting up Firestore Database

1. In the Firebase project dashboard, go to "Firestore Database" from the left sidebar
2. Click "Create database"
3. Choose "Start in production mode" (or test mode for development)
4. Select a location closest to your users and click "Enable"
5. Set up the following Firestore security rules to secure your data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // For simplicity, allow read/write access on all documents
    // In a production environment, you should implement proper security rules
    match /{document=**} {
      allow read, write;
    }
  }
}
```

## 3. Get Frontend Firebase Configuration

The frontend configuration has already been set up with the following values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyByYgX1E4LERyvaYyG4f-i4StuilUp06VI",
  authDomain: "paktravelapp.firebaseapp.com",
  projectId: "paktravelapp",
  storageBucket: "paktravelapp.firebasestorage.app",
  messagingSenderId: "63235963194",
  appId: "1:63235963194:web:85fe71d3fc0185ee0e3803",
  measurementId: "G-QKF8118D19"
};
```

This configuration is already in the `frontend/src/firebase.js` file.

## 4. Set up Backend with Firebase Admin SDK

For the backend, you need to generate a private key for the Firebase Admin SDK:

1. In the Firebase console, go to Project Settings (the gear icon)
2. Go to the "Service accounts" tab
3. Click "Generate new private key" button
4. Save the JSON file securely (do not commit this file to your repository)

### Option 1: Using the service account key file directly:

1. Place the downloaded JSON file in a secure location in your backend folder (e.g., `/backend/config/serviceAccountKey.json`)
2. Update the `/backend/firebaseConfig.js` file to use this file:

```javascript
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

### Option 2: Using environment variables (recommended for production):

1. Open the downloaded JSON file and extract the necessary values
2. Create a `.env` file in your backend directory based on the `.env.example` template
3. Add the private key and client email to your `.env` file:

```
PORT=5000
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour long private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@paktravelapp.iam.gserviceaccount.com
```

4. Update the `firebaseConfig.js` file to use these environment variables:

```javascript
const serviceAccount = {
  "type": "service_account",
  "project_id": "paktravelapp",
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  // Other fields from your service account key...
};
```

## 5. Running the Application

After setting up Firebase:

1. Start the backend:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```
   cd frontend
   npm start
   ```

## 6. Firestore Data Structure

This application uses the following Firestore data structure:

```
clients (collection)
  └── {phoneNumber} (document)
        ├── name
        ├── email
        ├── phoneNumber
        └── tours (subcollection)
              └── {tourId} (document)
                   ├── type
                   ├── price
                   ├── cost
                   ├── peopleCount
                   ├── date
                   └── profit
```

## 7. Security Considerations

For a production environment:

1. Store your Firebase credentials securely
2. Do not commit service account keys to version control
3. Use environment variables for sensitive information
4. Implement proper Firestore security rules
5. Consider adding authentication to secure your API endpoints 