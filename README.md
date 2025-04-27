# Pak Travel App

A comprehensive travel agency management system for managing clients, tours, and financials.

## Project Structure

- `/frontend` - React.js frontend application
- `/backend` - Node.js/Express backend API with Firebase integration

## Features

- Client management
- Tour booking and management
- Financial tracking
- Invoice generation
- Responsive design

## Installation

### Prerequisites

- Node.js (v14.0 or higher)
- npm or yarn
- Firebase account

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase credentials:
   - Create a `.env` file in the backend directory with your Firebase configuration
   - Or place your Firebase service account key at `backend/config/serviceAccountKey.json`

4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure API URL:
   - Create a `.env.local` file with:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

4. Start the frontend app:
   ```
   npm start
   ```

## Deployment

This application is configured for deployment to:
- Frontend: [Netlify](https://netlify.com)
- Backend: [Render.com](https://render.com)

See deployment guides:
- [Backend Deployment to Render.com](backend/README.md)
- [Frontend Environment Setup on Netlify](frontend/NETLIFY_ENV_SETUP.md)

## License

This project is licensed under the MIT License.
