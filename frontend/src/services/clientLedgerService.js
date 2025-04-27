import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  runTransaction 
} from 'firebase/firestore';
import { db } from '../firebase';

// Create or update a client ledger from existing client data
export const createClientLedgerFromExisting = async (clientData) => {
  try {
    console.log('Creating client ledger from existing data:', clientData);
    
    if (!clientData) {
      throw new Error('Client data is required');
    }
    
    // Get a valid phone number to use as document ID
    let phoneNumber = clientData.phoneNumber || clientData.phone;
    
    if (!phoneNumber) {
      console.error('Missing phone number in client data:', clientData);
      throw new Error('Valid phone number is required');
    }
    
    // Clean up the phone number - remove any non-numeric characters
    phoneNumber = phoneNumber.toString().replace(/\D/g, '');
    
    if (!phoneNumber) {
      throw new Error('Phone number contains no digits');
    }
    
    // Use phone number as document ID for easier lookups
    const clientId = phoneNumber;
    
    // Log the clientId we're about to use
    console.log('Using phone number as document ID:', clientId);
    
    const clientRef = doc(db, 'client_ledgers', clientId);
    
    // Check if client already exists
    const clientDoc = await getDoc(clientRef);
    
    if (clientDoc.exists()) {
      console.log('Client ledger already exists, returning existing data');
      const existingData = clientDoc.data();
      return {
        id: clientDoc.id,
        ...existingData,
        // Ensure numerical fields
        totalAmount: Number(existingData.totalAmount || 0),
        receivedAmount: Number(existingData.receivedAmount || 0),
        balance: Number(existingData.balance || 0),
      };
    }
    
    // Use provided name or get a real name for the client if possible
    let clientName = clientData.name || '';
    
    // If the name is missing or is a generic name, try to get the real name
    if (!clientName || clientName === 'Unknown Client' || clientName === 'Client' || clientName.startsWith('Client ')) {
      try {
        // We might need to import a function to get client details by phone
        // This would require adding a dependency to your API service
        const { getClientByPhone } = await import('../services/api');
        const clientDetails = await getClientByPhone(phoneNumber);
        if (clientDetails && clientDetails.name) {
          console.log('Retrieved client name from backend:', clientDetails.name);
          clientName = clientDetails.name;
        }
      } catch (nameErr) {
        console.warn('Could not retrieve client name from backend:', nameErr);
        // Keep using the provided name or generic name
      }
    }
    
    // Create new client document with existing client data
    const clientLedgerData = {
      name: clientName || 'Client ' + phoneNumber,
      phone: phoneNumber,
      email: clientData.email || '',
      notes: clientData.notes || '',
      totalAmount: 0,
      receivedAmount: 0,
      balance: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      // Store reference to original client ID if needed
      originalClientId: clientData._id || null
    };
    
    // Set document with specific ID (phone number)
    await setDoc(clientRef, clientLedgerData);
    
    console.log('Created new client ledger with ID:', clientId);
    
    // Verify the document was created
    const verifyDoc = await getDoc(clientRef);
    if (!verifyDoc.exists()) {
      console.error('Failed to verify document creation');
      throw new Error('Document creation failed');
    }
    
    return {
      id: clientId,
      ...clientLedgerData
    };
  } catch (error) {
    console.error('Error creating client ledger from existing:', error);
    throw new Error('Failed to create client ledger: ' + error.message);
  }
};

// Add a new client with initial ledger entry
export const addClientLedger = async (clientData) => {
  try {
    console.log('Adding client ledger, Data received:', clientData);
    
    // Create client document
    const clientRef = await addDoc(collection(db, 'client_ledgers'), {
      name: clientData.name,
      phone: clientData.phone,
      notes: clientData.notes || '',
      totalAmount: Number(clientData.initialAmount) || 0,
      receivedAmount: 0,
      balance: Number(clientData.initialAmount) || 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Add initial transaction if amount > 0
    if (clientData.initialAmount && Number(clientData.initialAmount) > 0) {
      const txnRef = collection(db, 'client_ledgers', clientRef.id, 'transactions');
      await addDoc(txnRef, {
        type: 'total',
        amount: Number(clientData.initialAmount),
        description: clientData.initialDescription || 'Initial balance',
        date: Timestamp.now(),
        createdAt: Timestamp.now()
      });
    }
    
    return clientRef.id;
  } catch (error) {
    console.error('Error adding client ledger:', error);
    throw new Error('Failed to add client ledger: ' + error.message);
  }
};

// Get all clients
export const getClientLedgers = async () => {
  try {
    const clientsQuery = query(
      collection(db, 'client_ledgers'),
      orderBy('name')
    );
    
    const snapshot = await getDocs(clientsQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting client ledgers:', error);
    throw new Error('Failed to fetch client ledgers');
  }
};

// Get client by ID
export const getClientLedgerById = async (clientId) => {
  try {
    console.log('Fetching client with ID:', clientId);
    
    if (!clientId) {
      throw new Error('Client ID is required');
    }
    
    const docRef = doc(db, 'client_ledgers', clientId);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      console.warn('Client not found with ID:', clientId);
      throw new Error('Client not found');
    }
    
    const data = snapshot.data();
    console.log('Client data retrieved:', data);
    
    return {
      id: snapshot.id,
      ...data,
      // Ensure numerical fields
      totalAmount: Number(data.totalAmount || 0),
      receivedAmount: Number(data.receivedAmount || 0),
      balance: Number(data.balance || 0),
    };
  } catch (error) {
    console.error('Error getting client ledger:', error);
    throw new Error('Failed to fetch client ledger: ' + error.message);
  }
};

// Get client by phone
export const getClientLedgerByPhone = async (phone) => {
  try {
    const clientsQuery = query(
      collection(db, 'client_ledgers'),
      where('phone', '==', phone)
    );
    
    const snapshot = await getDocs(clientsQuery);
    
    if (snapshot.empty) {
      throw new Error('Client not found');
    }
    
    // Return the first match (should be only one)
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error getting client ledger by phone:', error);
    throw new Error('Failed to fetch client ledger');
  }
};

// Search clients by name or phone
export const searchClientLedgers = async (searchTerm) => {
  try {
    // We need to fetch all and filter client-side
    // because Firestore doesn't support LIKE queries
    const clientsQuery = query(
      collection(db, 'client_ledgers'),
      orderBy('name')
    );
    
    const snapshot = await getDocs(clientsQuery);
    
    const results = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      );
    
    return results;
  } catch (error) {
    console.error('Error searching client ledgers:', error);
    throw new Error('Failed to search client ledgers');
  }
};

// Add transaction to client ledger
export const addClientTransaction = async (clientId, transactionData) => {
  try {
    console.log('Adding transaction for client:', clientId, transactionData);
    
    if (!clientId) {
      console.error('Missing clientId in addClientTransaction');
      throw new Error('Client ID is required');
    }
    
    const amount = Number(transactionData.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }
    
    const timestamp = transactionData.date instanceof Date 
      ? Timestamp.fromDate(transactionData.date)
      : Timestamp.now();
    
    // Run this as a transaction to ensure atomic updates
    await runTransaction(db, async (transaction) => {
      // Get client reference
      const clientRef = doc(db, 'client_ledgers', clientId);
      
      console.log('Getting client document for ID:', clientId);
      const clientDoc = await transaction.get(clientRef);
      
      if (!clientDoc.exists()) {
        console.error(`Client document with ID ${clientId} not found in Firestore`);
        throw new Error('Client not found');
      }
      
      console.log('Client document exists, data:', clientDoc.data());
      const clientData = clientDoc.data();
      
      // Create the transaction document
      const txnCollectionRef = collection(clientRef, 'transactions');
      const newTxnRef = doc(txnCollectionRef);
      
      // Prepare transaction data
      const txnData = {
        type: transactionData.type,
        amount: amount,
        description: transactionData.description,
        date: timestamp,
        createdAt: Timestamp.now()
      };
      
      // Update client totals
      let newTotalAmount = Number(clientData.totalAmount || 0);
      let newReceivedAmount = Number(clientData.receivedAmount || 0);
      
      if (transactionData.type === 'total') {
        newTotalAmount += amount;
      } else if (transactionData.type === 'received') {
        newReceivedAmount += amount;
      }
      
      const newBalance = newTotalAmount - newReceivedAmount;
      
      console.log('Updating client totals:', {
        totalAmount: newTotalAmount,
        receivedAmount: newReceivedAmount,
        balance: newBalance
      });
      
      // Set transaction and update client document
      transaction.set(newTxnRef, txnData);
      transaction.update(clientRef, {
        totalAmount: newTotalAmount,
        receivedAmount: newReceivedAmount,
        balance: newBalance,
        updatedAt: Timestamp.now()
      });
    });
    
    console.log('Transaction added successfully');
    return true;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw new Error('Failed to add transaction: ' + error.message);
  }
};

// Get transactions for a client (non-real-time version)
export const getClientTransactionsDirect = async (clientId) => {
  try {
    console.log('Fetching transactions for client:', clientId);
    
    if (!clientId) {
      throw new Error('Client ID is required');
    }
    
    const txnQuery = query(
      collection(db, 'client_ledgers', clientId, 'transactions'),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(txnQuery);
    
    if (snapshot.empty) {
      console.log('No transactions found for client:', clientId);
      return [];
    }
    
    const transactions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to JS Date
        date: data.date ? data.date.toDate() : new Date(),
        // Ensure numerical amount
        amount: Number(data.amount || 0)
      };
    });
    
    console.log(`Retrieved ${transactions.length} transactions`);
    return transactions;
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw new Error('Failed to fetch transactions: ' + error.message);
  }
};

// Get client with live updates
export const getClientLedgerWithUpdates = (clientId, callback) => {
  try {
    const clientRef = doc(db, 'client_ledgers', clientId);
    
    // Set up realtime listener
    const unsubscribe = onSnapshot(clientRef, (doc) => {
      if (doc.exists()) {
        const clientData = {
          id: doc.id,
          ...doc.data()
        };
        callback(clientData);
      } else {
        callback(null, new Error('Client not found'));
      }
    }, (error) => {
      console.error('Error in client listener:', error);
      callback(null, error);
    });
    
    // Return unsubscribe function
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up client listener:', error);
    callback(null, error);
    return () => {};
  }
}; 