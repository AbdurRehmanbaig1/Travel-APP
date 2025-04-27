# Backend Deployment Options

This comprehensive guide provides detailed instructions for deploying the Travel Agency Management System backend API to work with your Netlify-hosted frontend.

## Requirements for Backend Deployment

Your backend needs to meet these requirements:
1. Publicly accessible URL that can be reached from your Netlify frontend
2. CORS configured to allow requests from your Netlify domain
3. Environment variables properly set for Firebase credentials and other configurations
4. Node.js runtime environment (v14.0 or higher recommended)

## Deployment Options

### 1. Render.com (Recommended for Simplicity)

[Render](https://render.com/) offers a free tier for web services with straightforward deployment.

#### Step-by-Step Instructions:

1. **Sign up for Render**
   - Create an account at [render.com](https://render.com/)

2. **Create a New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure the Service**
   - **Name**: `travel-agency-api` (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

4. **Set Environment Variables**
   - Click on "Environment" tab
   - Add the following variables:
     ```
     PORT=10000
     FIREBASE_PRIVATE_KEY="your-private-key-here"
     FIREBASE_CLIENT_EMAIL=your-client-email@serviceaccount.com
     FIREBASE_PROJECT_ID=your-project-id
     ```
   - Note: Copy the Firebase private key exactly as it appears in your service account JSON

5. **Deploy**
   - Click "Create Web Service" and wait for the deployment to complete

### 2. Heroku

[Heroku](https://www.heroku.com/) is a mature platform with excellent Node.js support.

#### Step-by-Step Instructions:

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create an App**
   ```bash
   heroku login
   heroku create travel-agency-api
   ```

3. **Configure for Subfolder Deployment**
   Create a `Procfile` in your project root with:
   ```
   web: cd backend && npm start
   ```

4. **Add Environment Variables**
   ```bash
   heroku config:set FIREBASE_PRIVATE_KEY="your-private-key-here"
   heroku config:set FIREBASE_CLIENT_EMAIL=your-client-email@serviceaccount.com
   heroku config:set FIREBASE_PROJECT_ID=your-project-id
   ```

5. **Deploy**
   If your backend is in a subdirectory:
   ```bash
   git subtree push --prefix backend heroku main
   ```
   Or, if deploying the entire repo:
   ```bash
   git push heroku main
   ```

### 3. Firebase Cloud Functions (Integrated Solution)

Since the project already uses Firebase, you can deploy your API as Cloud Functions.

#### Step-by-Step Instructions:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**
   ```bash
   firebase login
   cd backend
   firebase init functions
   ```

3. **Convert Express App to Cloud Function**
   Create an `index.js` file in your functions directory:
   ```javascript
   const functions = require('firebase-functions');
   const app = require('./app'); // Move your Express app to a separate file

   exports.api = functions.https.onRequest(app);
   ```

4. **Deploy**
   ```bash
   firebase deploy --only functions
   ```

## Configuring CORS

Ensure your Express app has proper CORS configuration to allow requests from your Netlify domain:

```javascript
// In backend/index.js
const cors = require('cors');

// For development, you can allow all origins
app.use(cors());

// For production, specify allowed origins
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-app.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

## Firebase Configuration

Since this application uses Firebase Admin SDK, you need to ensure your service account credentials are properly set up:

1. **Option 1: Using environment variables (recommended for production)**
   ```javascript
   // In backend/firebaseConfig.js
   const admin = require('firebase-admin');

   const serviceAccount = {
     type: 'service_account',
     project_id: process.env.FIREBASE_PROJECT_ID,
     private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
     client_email: process.env.FIREBASE_CLIENT_EMAIL,
     // Other fields are optional for the Admin SDK
   };

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });
   ```

2. **Option 2: Using a service account key file (simpler for development)**
   - Download your service account key from Firebase Console
   - Store it safely in your deployment environment
   - Make sure it's not committed to your repository

## Post-Deployment Steps

1. **Test your API endpoints**
   - Verify that your API is accessible
   - Test client and tour endpoints to ensure database connectivity

2. **Update frontend environment variables**
   - Go to your Netlify dashboard → Site settings → Environment variables
   - Update `REACT_APP_API_URL` to point to your new backend URL

3. **Trigger a frontend redeployment**
   - In Netlify: Go to Deploys → Trigger deploy

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check that your CORS configuration includes your Netlify domain
   - Verify that OPTIONS requests are handled correctly for preflight checks

2. **Firebase Authentication Errors**
   - Ensure private key is properly formatted (replace escaped newlines)
   - Verify that service account has proper permissions

3. **Environment Variable Issues**
   - Confirm that all required variables are set
   - Check for typos in variable names
   - For Heroku, ensure values with special characters are properly quoted

4. **404 Errors**
   - Check that your API routes are correctly defined
   - Verify that API URL in frontend has the correct path (/api)

5. **Database Connection Issues**
   - Ensure your IP is not restricted in Firebase Security Rules
   - Check Firebase console for any service disruptions

## Monitoring and Scaling

1. **Basic Monitoring**
   - Use the logging features of your hosting platform
   - Add detailed logging in your application for errors

2. **Advanced Monitoring**
   - Consider adding a service like Sentry or LogRocket
   - Implement health check endpoints for uptime monitoring

3. **Scaling Considerations**
   - Free tiers will have limitations on requests and idle time
   - Upgrade your plan when traffic increases
   - Consider Firebase plan limitations for database operations 