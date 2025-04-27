import { collection, addDoc, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { db } from '../firebase';

// Add a new transaction to Firestore
export const addTransaction = async (transactionData) => {
  try {
    console.log('Adding transaction, Data received:', transactionData);
    
    // Convert date to Firestore Timestamp
    let timestamp;
    try {
      // Handle different date formats
      if (transactionData.date instanceof Date) {
        timestamp = Timestamp.fromDate(transactionData.date);
        console.log('Date is a Date object, converted to timestamp');
      } else if (typeof transactionData.date === 'string') {
        const dateObj = new Date(transactionData.date);
        console.log('Converting string date to Date object:', dateObj);
        timestamp = Timestamp.fromDate(dateObj);
      } else {
        // Fallback to current date if date is invalid
        console.warn('Invalid date format, using current date');
        timestamp = Timestamp.now();
      }
      console.log('Timestamp created:', timestamp);
    } catch (dateError) {
      console.error('Error converting date:', dateError);
      timestamp = Timestamp.now(); // Fallback to current date
    }
    
    // Prepare data for Firestore
    const firestoreData = {
      title: transactionData.title,
      amount: Number(transactionData.amount),
      type: transactionData.type,
      notes: transactionData.notes || '',
      date: timestamp,
      createdAt: Timestamp.now()
    };
    
    console.log('Sending to Firestore:', firestoreData);
    console.log('Using Firestore instance:', db);
    
    // Check for Firestore connectivity
    try {
      // Test connectivity with a small document
      const testRef = collection(db, 'test_connectivity');
      await addDoc(testRef, { test: true, timestamp: Timestamp.now() });
      console.log('Firestore connectivity test successful');
    } catch (connectError) {
      console.error('Firestore connectivity test failed:', connectError);
      throw new Error('Cannot connect to Firestore: ' + connectError.message);
    }
    
    // Create the transaction document
    const docRef = await addDoc(collection(db, 'transactions'), firestoreData);
    console.log('Transaction added with ID:', docRef.id);
    
    return { 
      id: docRef.id, 
      ...transactionData,
      amount: Number(transactionData.amount)
    };
  } catch (error) {
    console.error('Error adding transaction:', error);
    console.error('Error details:', {
      code: error.code,
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw new Error('Failed to add transaction: ' + error.message);
  }
};

// Get all transactions from Firestore
export const getTransactions = async (filters = {}) => {
  try {
    let transactionsQuery = query(
      collection(db, 'transactions'), 
      orderBy('date', 'desc')
    );
    
    // Apply date range filter if provided
    if (filters.startDate && filters.endDate) {
      const startTimestamp = Timestamp.fromDate(new Date(filters.startDate));
      const endTimestamp = Timestamp.fromDate(new Date(filters.endDate));
      
      transactionsQuery = query(
        collection(db, 'transactions'),
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp),
        orderBy('date', 'desc')
      );
    }
    
    const snapshot = await getDocs(transactionsQuery);
    
    // Map the documents to a more usable format
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(), // Convert Firestore Timestamp to JS Date
      };
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
};

// Calculate transaction totals
export const calculateTotals = (transactions) => {
  return transactions.reduce((totals, transaction) => {
    const amount = Number(transaction.amount);
    
    if (transaction.type === 'income') {
      totals.income += amount;
    } else if (transaction.type === 'expense') {
      totals.expense += amount;
    }
    
    // Calculate the balance
    totals.balance = totals.income - totals.expense;
    
    return totals;
  }, { income: 0, expense: 0, balance: 0 });
}; 