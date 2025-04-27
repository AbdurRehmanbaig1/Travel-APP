# Pak Travel Guide Frontend

A modern React application showcasing traveling opportunities in Pakistan with interactive maps and travel information.

## Features

- Interactive maps of Pakistan with tourist attractions
- Destination gallery with filtering
- Tour packages and booking functionality
- User authentication
- Responsive design for all devices

## Technology Stack

- React
- React Router for navigation
- Firebase for authentication
- Redux Toolkit for state management
- Leaflet for maps
- Tailwind CSS for styling

## Installation and Setup

### Prerequisites
- Node.js (v14.0 or higher)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/your-username/pak-travel-app.git
cd pak-travel-app/frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the frontend directory with the following variables:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

4. Start the development server
```bash
npm start
# or
yarn start
```

The app will be available at http://localhost:3000

## Build for Production

```bash
npm run build
# or
yarn build
```

This will create a `build` folder with optimized production files.

## Deployment to Netlify

### Method 1: Netlify UI (Easiest)

1. Create a Netlify account at [netlify.com](https://www.netlify.com/)
2. Click "New site from Git"
3. Select your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Configure build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/build`
6. Click "Deploy site"
7. Go to Site settings > Build & deploy > Environment variables
8. Add all the environment variables from your `.env` file

### Method 2: Netlify CLI

1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

2. Login to Netlify
```bash
netlify login
```

3. Initialize Netlify in your project
```bash
cd frontend
netlify init
```

4. Follow the prompts to create a new site or connect to an existing one
5. Configure your build settings when prompted
6. Deploy the site
```bash
netlify deploy --prod
```

7. Set up environment variables
```bash
netlify env:set REACT_APP_API_URL https://your-backend-url.com/api
# Repeat for all environment variables
```

### Method 3: netlify.toml Configuration

1. Create a `netlify.toml` file in the root of your project:
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "build"

[context.production.environment]
  REACT_APP_API_URL = "https://your-backend-url.com/api"
  # Add other environment variables here
```

2. Deploy using Netlify UI or CLI as described above

## Continuous Deployment

After connecting your repository to Netlify, every push to the main branch will trigger a new build and deployment automatically.

## Customizing the Domain

1. In the Netlify dashboard, go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to set up either:
   - A domain you purchased from Netlify
   - A domain you purchased elsewhere (requires DNS configuration)

## Troubleshooting Deployment

- If assets aren't loading, check if paths are using absolute URLs
- For routing issues, create a `_redirects` file in the public folder with:
  ```
  /*    /index.html   200
  ```
- For environment variable issues, verify they are prefixed with `REACT_APP_`

See [BACKEND_DEPLOYMENT.md](./BACKEND_DEPLOYMENT.md) for instructions on how to deploy the backend API.
