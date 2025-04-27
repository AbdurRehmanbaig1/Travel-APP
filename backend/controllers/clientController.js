const { db } = require('../firebaseConfig');

// Add a new client
exports.addClient = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { name, phoneNumber, email, address, city, country } = req.body;

    if (!name || !phoneNumber || !email) {
      console.log('Validation error - missing fields:', { name, phoneNumber, email });
      return res.status(400).json({ error: 'Name, phone number, and email are required' });
    }

    console.log('Checking if client exists:', phoneNumber);
    // Check if client already exists
    const clientDoc = await db.collection('clients').doc(phoneNumber).get();
    
    if (clientDoc.exists) {
      console.log('Client already exists with phone number:', phoneNumber);
      return res.status(400).json({ error: 'A client with this phone number already exists' });
    }

    console.log('Adding new client:', { name, phoneNumber, email });
    // Add new client
    await db.collection('clients').doc(phoneNumber).set({
      name,
      email,
      phoneNumber,
      address: address || '',
      city: city || '',
      country: country || '',
      createdAt: new Date().toISOString()
    });

    console.log('Client added successfully:', phoneNumber);
    return res.status(201).json({ message: 'Client added successfully' });
  } catch (error) {
    console.error('Error adding client:', error);
    return res.status(500).json({ error: 'Failed to add client' });
  }
};

// Get client details by phone number including tours
exports.getClientByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    console.log('Fetching client by phone:', phone);
    
    // Get client details
    const clientDoc = await db.collection('clients').doc(phone).get();
    
    if (!clientDoc.exists) {
      console.log('Client not found:', phone);
      return res.status(404).json({ error: 'Client not found' });
    }
    
    const clientData = clientDoc.data();
    console.log('Client found:', clientData);
    
    // Get client's tours
    const toursSnapshot = await db.collection('clients').doc(phone).collection('tours').get();
    
    const tours = [];
    toursSnapshot.forEach(doc => {
      tours.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Found ${tours.length} tours for client:`, phone);
    return res.status(200).json({
      client: clientData,
      tours
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    return res.status(500).json({ error: 'Failed to fetch client details' });
  }
};

// List all clients
exports.getAllClients = async (req, res) => {
  try {
    console.log('Fetching all clients');
    const clientsSnapshot = await db.collection('clients').get();
    
    const clients = [];
    clientsSnapshot.forEach(doc => {
      clients.push({
        phoneNumber: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Found ${clients.length} clients`);
    return res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return res.status(500).json({ error: 'Failed to fetch clients' });
  }
}; 