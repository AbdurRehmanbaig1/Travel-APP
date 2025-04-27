# Deploying to Vercel

Follow these steps to deploy your Pak Travel App to Vercel:

## Prerequisites
- A Vercel account
- Git repository for your project

## Steps

1. **Push your code to GitHub**
   Make sure your code is in a GitHub repository.

2. **Install Vercel CLI** (optional)
   ```
   npm install -g vercel
   ```

3. **Log in to Vercel**
   ```
   vercel login
   ```

4. **Deploy from the command line**
   Navigate to your project directory and run:
   ```
   vercel
   ```

   OR

5. **Deploy directly from Vercel Dashboard**:
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings:
     - Root Directory: `./` (or leave empty)
     - Build Command: Leave as default (will be read from vercel.json)
     - Output Directory: Leave as default (will be read from vercel.json)

6. **Environment Variables**
   Add the following environment variables in Vercel project settings:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_CLIENT_ID` 
   - `FIREBASE_CLIENT_CERT_URL`
   - `FRONTEND_URL` (your production frontend URL - typically your-app.vercel.app)

7. **Deploy**
   Click "Deploy" and wait for the build to complete.

## Troubleshooting

- If you encounter CORS issues, check the CORS configuration in `backend/index.js`
- For Firebase connectivity issues, ensure all Firebase environment variables are correctly set
- If you need to redeploy with changes, push to GitHub or run `vercel --prod` to override the production deployment 