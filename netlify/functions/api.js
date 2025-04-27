const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const path = require('path');

// Import your backend routes
const clientRoutes = require('../../backend/routes/clientRoutes');
const tourRoutes = require('../../backend/routes/tourRoutes');

// Import Firebase config
const { admin, db } = require('../../backend/firebaseConfig');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/clients', clientRoutes);
app.use('/api/tours', tourRoutes);

// Root route
app.get('/api', (req, res) => {
  res.json({ message: 'Travel Agency Management API' });
});

// Wrap Express app with serverless
module.exports.handler = serverless(app); 