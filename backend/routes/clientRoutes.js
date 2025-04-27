const express = require('express');
const { addClient, getClientByPhone, getAllClients } = require('../controllers/clientController');

const router = express.Router();

// POST /api/clients - Add a new client
router.post('/', addClient);

// GET /api/clients/:phone - Get client by phone number with their tours
router.get('/:phone', getClientByPhone);

// GET /api/clients - Get all clients
router.get('/', getAllClients);

module.exports = router; 