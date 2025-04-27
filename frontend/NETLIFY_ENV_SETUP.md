# Setting Up Environment Variables on Netlify

This guide explains how to set up the necessary environment variables for your Pak Travel App on Netlify to connect with your backend API.

## Why Environment Variables?

Your app is failing to load client data on Netlify because it can't find the backend API. This happens because the app is defaulting to `http://localhost:5000/api` when deployed, which won't work on the internet.

## Step 1: Get Your Backend URL

After deploying your backend to Render.com, you should have a URL like:
```
https://pak-travel-api.onrender.com
```

## Step 2: Add Environment Variable to Netlify

1. Log in to your [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **Site Configuration > Environment variables**
4. Click **Add a variable**
5. Add the following:
   - Key: `REACT_APP_API_URL`
   - Value: `https://pak-travel-api.onrender.com/api` (make sure to include `/api` at the end)
6. Click **Save**

## Step 3: Redeploy Your Site

1. Go to the **Deploys** tab in your Netlify dashboard
2. Click **Trigger deploy** > **Deploy site**

## Step 4: Verify the Connection

1. Wait for the deployment to complete
2. Visit your site (e.g., `https://paktravels.netlify.app`)
3. Check if clients are loading properly now

## Troubleshooting

If you're still having issues:

1. **Check Browser Console**: Open your browser's developer tools (F12) and look for any errors
2. **Verify Backend is Running**: Visit your backend URL directly (e.g., `https://pak-travel-api.onrender.com`) to make sure it's online
3. **CORS Issues**: Make sure your backend is properly configured to accept requests from your Netlify domain
4. **Check Environment Variables**: Verify the environment variable was set correctly in Netlify
5. **API Endpoint**: Ensure the backend API endpoints match what your frontend is expecting

## Additional Information

* Netlify automatically uses environment variables during the build process
* Any changes to environment variables require a new deployment to take effect
* Environment variables are kept secure and are not exposed in your frontend code
* For local development, you can create a `.env.local` file with the same variables 