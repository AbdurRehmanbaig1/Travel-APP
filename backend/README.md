# Pak Travel Backend Deployment to Render.com

This guide will walk you through deploying the Pak Travel backend API to Render.com.

## Step 1: Create a Render.com Account

1. Go to [Render.com](https://render.com/) and sign up for an account if you don't have one
2. Verify your email address

## Step 2: Create a New Web Service

1. Click on the "New +" button in the top right corner
2. Select "Web Service"
3. Connect your GitHub repository (or use the option to deploy from a public repository)
4. Configure the service:
   - **Name**: pak-travel-api (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

## Step 3: Set Environment Variables

In your Render dashboard, go to the "Environment" tab and add the following environment variables:

```
PORT=10000
FRONTEND_URL=https://paktravels.netlify.app (change to your Netlify URL)
FIREBASE_PROJECT_ID=paktravelapp
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@paktravelapp.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40paktravelapp.iam.gserviceaccount.com
```

You can get these Firebase credentials from your Firebase console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Use the values from the downloaded JSON file for the environment variables

## Step 4: Deploy

1. Click "Create Web Service"
2. Wait for the deployment to complete (this may take a few minutes)

## Step 5: Note the API URL

After deployment, Render will provide you with a URL for your service (e.g., `https://pak-travel-api.onrender.com`).

## Step 6: Configure Your Frontend

Set the `REACT_APP_API_URL` environment variable in your Netlify deployment:

1. Go to your Netlify dashboard
2. Select your site
3. Go to Site Configuration > Environment variables
4. Add a new variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://pak-travel-api.onrender.com/api` (use your Render URL)
5. Click "Save"

## Step 7: Trigger a New Netlify Deployment

1. Go to the "Deploys" tab in your Netlify dashboard
2. Click "Trigger deploy" > "Deploy site"

Your application should now work with the backend hosted on Render.com and the frontend on Netlify. 