#!/bin/bash
# Deployment script for Netlify

# Make sure we're in the frontend directory
cd "$(dirname "$0")" || exit 1

echo "🚀 Starting deployment to Netlify..."

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "⚠️ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Netlify CLI. Please install it manually with: npm install -g netlify-cli"
        exit 1
    fi
fi

# Build the app
echo "🔨 Building the React app..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

# Deploy to Netlify
echo "📤 Deploying to Netlify..."
netlify deploy --prod --dir=build
if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo "Note: Make sure your backend API URL is correctly set in the Netlify environment variables." 