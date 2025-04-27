# Manual Deployment to Netlify

This guide provides step-by-step instructions for deploying the Pak Travel app to Netlify using the command line.

## Prerequisites

1. Ensure you have Node.js installed (v14 or higher recommended)
2. A GitHub account with your code pushed to a repository
3. A Netlify account (https://app.netlify.com/signup)

## Steps for Deployment

### 1. Prepare Your Frontend for Production

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a build of your application:
   ```bash
   npm run build
   ```

   This will create a `build` folder with optimized production files.

### 2. Deploy to Netlify

#### Option 1: Using Netlify CLI

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Log in to your Netlify account:
   ```bash
   netlify login
   ```

3. Initialize a new Netlify site:
   ```bash
   netlify init
   ```
   - Select "Create & configure a new site"
   - Choose your team
   - Enter a site name (or press Enter for a random name)

4. Configure deployment settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build` (or already built)
   - **Functions directory**: (leave empty)

5. Set environment variables:
   ```bash
   netlify env:set REACT_APP_API_URL https://your-backend-api.com/api
   ```

6. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

#### Option 2: Drag and Drop Deployment

1. Go to https://app.netlify.com/ and log in
2. Drag and drop your `build` folder to the Netlify dashboard
3. Set environment variables in the Netlify dashboard:
   - Site Settings > Build & deploy > Environment > Environment variables
   - Add `REACT_APP_API_URL` with your backend API URL

#### Option 3: Connecting to GitHub

1. Go to https://app.netlify.com/ and click "New site from Git"
2. Select GitHub as your Git provider
3. Choose your repository
4. Configure build settings:
   - **Base directory**: `frontend` (since your React app is in this folder)
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Set environment variables in Advanced settings
6. Click "Deploy site"

## After Deployment

1. Verify your site is working by visiting the Netlify URL
2. Check for any console errors in your browser's developer tools
3. Test all functionality to ensure it works with your backend API

## Troubleshooting

- If API calls fail, check that your `REACT_APP_API_URL` is correctly set
- Make sure CORS is enabled on your backend to allow requests from your Netlify domain
- If routes don't work, ensure the `_redirects` file is in the `public` folder
- For more help, visit the Netlify support forums: https://answers.netlify.com/ 