# Netlify Deployment Quick Start

## Fastest Way to Deploy

1. **Build your app locally**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy using Netlify Drop**:
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag and drop your entire `build` folder
   - Your site will be instantly deployed with a Netlify subdomain

## Setting Environment Variables

After deployment, set your backend API URL:

1. Go to Site settings > Build & deploy > Environment
2. Click "Add variable"
3. Set `REACT_APP_API_URL` to your backend API URL
4. Trigger a redeploy for changes to take effect

## Connect to GitHub for Continuous Deployment

1. Go to [Netlify](https://app.netlify.com/)
2. Click "New site from Git"
3. Select GitHub and authorize
4. Choose your repository
5. Set build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
6. Click "Deploy site"

## Important Files Already Set Up

- `netlify.toml`: Contains build settings and redirect rules
- `public/_redirects`: Handles client-side routing
- Modified API service: Now uses environment variables

## Testing Your Deployment

- Visit your Netlify URL and verify it works
- Check browser console for errors
- Test all features that use the backend API

For a more detailed guide, see `MANUAL_DEPLOYMENT_STEPS.md`. 