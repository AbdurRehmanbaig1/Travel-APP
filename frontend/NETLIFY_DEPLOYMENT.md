# Deploying to Netlify

This document contains instructions for deploying the Pak Travel app to Netlify.

## Prerequisites

- A Netlify account (https://app.netlify.com/signup)
- Your project code pushed to a GitHub/GitLab/BitBucket repository

## Deployment Steps

### 1. Create a local .env.local file (for development only)

Create a `.env.local` file in the frontend directory with:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Connect your repository to Netlify

1. Log in to Netlify
2. Click "New site from Git"
3. Select your Git provider (GitHub, GitLab, or BitBucket)
4. Authorize Netlify to access your repositories
5. Select the repository containing your Pak Travel app

### 3. Configure build settings

Configure the following settings:
- **Branch to deploy**: `main` (or your default branch)
- **Base directory**: `frontend` (since your React app is in the frontend folder)
- **Build command**: `npm run build`
- **Publish directory**: `build`

### 4. Set environment variables

In Netlify's UI, go to:
1. Site settings > Build & deploy > Environment > Environment variables
2. Add the following environment variables:
   - `REACT_APP_API_URL`: URL of your backend API (e.g., `https://your-backend.herokuapp.com/api`)

### 5. Deploy

Click the "Deploy site" button and wait for the build to complete.

### 6. Configure custom domain (optional)

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to set up your domain

## Handling Updates

When you push changes to your repository, Netlify will automatically redeploy your site.

## Troubleshooting

- If the page shows a white screen, check the browser console for errors
- Verify your environment variables are correctly set
- Check that your backend API is accessible from the Netlify domain 