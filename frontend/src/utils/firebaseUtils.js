import { collection, addDoc, getDocs, query, limit, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Tests Firestore connectivity and permissions
 * @returns {Promise<Object>} Test results
 */
export const testFirebaseConnectivity = async () => {
  const results = {
    success: false,
    readSuccess: false,
    writeSuccess: false,
    deleteSuccess: false,
    errors: []
  };

  try {
    // Generate a unique test document ID
    const testDocId = `test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const testData = { 
      timestamp: Timestamp.now(),
      testId: testDocId,
      message: 'Test connectivity document'
    };
    
    console.log('Testing Firestore connectivity...');
    
    // Test writing to Firestore
    try {
      const testCollection = collection(db, 'connectivity_tests');
      const docRef = await addDoc(testCollection, testData);
      console.log('Write test passed, document created with ID:', docRef.id);
      results.writeSuccess = true;
      
      // Test reading from Firestore
      try {
        const q = query(collection(db, 'connectivity_tests'), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          console.log('Read test passed, document retrieved');
          results.readSuccess = true;
        } else {
          console.log('Read test failed, no documents retrieved');
          results.errors.push('No documents found when reading');
        }
        
        // Test deleting from Firestore
        try {
          await deleteDoc(docRef);
          console.log('Delete test passed, document deleted');
          results.deleteSuccess = true;
        } catch (deleteError) {
          console.error('Delete test failed:', deleteError);
          results.errors.push(`Delete error: ${deleteError.message}`);
        }
      } catch (readError) {
        console.error('Read test failed:', readError);
        results.errors.push(`Read error: ${readError.message}`);
      }
    } catch (writeError) {
      console.error('Write test failed:', writeError);
      results.errors.push(`Write error: ${writeError.message}`);
    }
    
    // Overall success if all operations worked
    results.success = results.readSuccess && results.writeSuccess && results.deleteSuccess;
    
    return results;
  } catch (error) {
    console.error('Firestore connectivity test failed:', error);
    results.errors.push(`General error: ${error.message}`);
    return results;
  }
}; 