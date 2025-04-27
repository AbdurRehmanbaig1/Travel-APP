import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  getClientLedgerById,
  getClientTransactionsDirect,
  getClientLedgers,
  createClientLedgerFromExisting
} from '../services/clientLedgerService';
import { getAllClients, getClientByPhone } from '../services/api';
import ClientLedgerTable from '../components/ledger/ClientLedgerTable';
import AddTransactionForm from '../components/ledger/AddTransactionForm';
import ClientSearch from '../components/ledger/ClientSearch';

const ClientLedger = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [existingClients, setExistingClients] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger', 'add-transaction', 'search'
  const [ledgerClientId, setLedgerClientId] = useState(null); // Store the actual Firestore document ID
  const [success, setSuccess] = useState('');
  
  // Debug changes to ledgerClientId
  useEffect(() => {
    console.log('ledgerClientId changed to:', ledgerClientId);
  }, [ledgerClientId]);
  
  // Load the existing clients from the system
  useEffect(() => {
    const fetchExistingClients = async () => {
      try {
        const data = await getAllClients();
        setExistingClients(data);
      } catch (err) {
        console.error('Error loading existing clients:', err);
      }
    };
    
    fetchExistingClients();
  }, []);
  
  useEffect(() => {
    const loadData = async () => {
      console.log('loadData called with clientId:', clientId);
      console.log('Current ledgerClientId state:', ledgerClientId);
      setLoading(true);
      setError('');
      
      try {
        if (clientId) {
          // We have a client ID, load the specific client
          setActiveTab('ledger');
          
          console.log('Loading client data for ID:', clientId);
          
          // Check if we're dealing with a direct URL access that might use a phone number
          // Clean the clientId to handle potential phone number formatting
          const cleanClientId = clientId.toString().replace(/\D/g, '');
          console.log('Clean client ID for lookup:', cleanClientId);
          
          try {
            // First try to get from ledger system using the cleaned ID
            try {
              const clientData = await getClientLedgerById(cleanClientId);
              console.log('Found client in ledger system with ID:', clientData.id);
              setClient(clientData);
              setLedgerClientId(clientData.id);
            } catch (cleanIdErr) {
              // If that fails, try the original ID
              console.log('Failed with clean ID, trying original ID');
              const clientData = await getClientLedgerById(clientId);
              console.log('Found client in ledger system with original ID:', clientData.id);
              setClient(clientData);
              setLedgerClientId(clientData.id);
            }
          } catch (ledgerErr) {
            console.error('Error loading from ledger, checking existing clients:', ledgerErr);
            
            // Try to find in existing clients by phone
            let matchingClient;
            
            // First try to get detailed client info by phone number
            try {
              // Try with both original and cleaned clientId
              if (clientId.match(/^\d+$/) || cleanClientId) {
                console.log('Trying to get client by phone with cleaned ID:', cleanClientId);
                matchingClient = await getClientByPhone(cleanClientId || clientId);
              }
            } catch (phoneErr) {
              console.error('Error fetching client by phone:', phoneErr);
            }
            
            // If not found by phone, try to find in existing clients list
            if (!matchingClient && existingClients.length > 0) {
              console.log('Searching in existing clients list with both IDs');
              matchingClient = existingClients.find(c => 
                c.phoneNumber === clientId || 
                c.phoneNumber === cleanClientId || 
                c._id === clientId
              );
            }
            
            if (matchingClient) {
              console.log('Found matching client in existing system:', matchingClient);
              
              // Create a client ledger document for this existing client
              try {
                // Make sure we have the phone number in the proper format
                const clientToUse = {
                  ...matchingClient,
                  phoneNumber: matchingClient.phoneNumber || cleanClientId || clientId
                };
                
                const ledgerClient = await createClientLedgerFromExisting(clientToUse);
                console.log('Created/retrieved ledger client:', ledgerClient);
                console.log('Setting ledgerClientId to:', ledgerClient.id);
                setClient(ledgerClient);
                setLedgerClientId(ledgerClient.id);
              } catch (createErr) {
                console.error('Error creating ledger client:', createErr);
                // Still show the client data even if we couldn't create a ledger
                const newLedgerClient = {
                  id: matchingClient._id || clientId,
                  name: matchingClient.name,
                  phone: matchingClient.phoneNumber || cleanClientId || clientId,
                  email: matchingClient.email,
                  totalAmount: 0,
                  receivedAmount: 0,
                  balance: 0
                };
                
                console.log('Using fallback client data with phone as ID:', newLedgerClient.phone);
                setClient(newLedgerClient);
                
                // Store the phone number as ledger ID for this client
                setLedgerClientId(newLedgerClient.phone);
              }
            } else {
              // If we couldn't find the client in any system, attempt to get the name from backend
              console.log('Client not found in any system, trying to get client name from backend');
              try {
                // Try to get client info from backend using the phone number
                const backendClient = await getClientByPhone(cleanClientId || clientId);
                console.log('Found client name from backend:', backendClient.name);
                
                const placeholderClient = {
                  id: cleanClientId || clientId,
                  name: backendClient.name,
                  phone: cleanClientId || clientId,
                  email: backendClient.email || '',
                  totalAmount: 0,
                  receivedAmount: 0,
                  balance: 0
                };
                
                setClient(placeholderClient);
              } catch (nameErr) {
                console.log('Could not get client name from backend, looking for client in client list by phone');
                
                // Try to find in the existing client list by phone number
                const matchInList = existingClients.find(c => 
                  c.phoneNumber === clientId || 
                  c.phoneNumber === cleanClientId
                );
                
                if (matchInList) {
                  console.log('Found client in list:', matchInList.name);
                  const placeholderClient = {
                    id: cleanClientId || clientId,
                    name: matchInList.name,
                    phone: cleanClientId || clientId,
                    email: matchInList.email || '',
                    totalAmount: 0,
                    receivedAmount: 0,
                    balance: 0
                  };
                  setClient(placeholderClient);
                } else {
                  // If all else fails, check if the clientId is in the URL format that contains the client name
                  // Format might be something like "Sohail-03037255114"
                  if (clientId && clientId.includes('-')) {
                    const namePart = clientId.split('-')[0];
                    const phonePart = clientId.split('-')[1] || cleanClientId || clientId;
                    
                    const placeholderClient = {
                      id: phonePart,
                      name: namePart,
                      phone: phonePart,
                      totalAmount: 0,
                      receivedAmount: 0,
                      balance: 0
                    };
                    setClient(placeholderClient);
                  } else {
                    // Default fallback - use the client ID as the name with "Client" prefix
                    const placeholderClient = {
                      id: cleanClientId || clientId,
                      name: "Client " + (cleanClientId || clientId),
                      phone: cleanClientId || clientId,
                      totalAmount: 0,
                      receivedAmount: 0,
                      balance: 0
                    };
                    setClient(placeholderClient);
                  }
                }
              }
            }
          }
          
          // Get transactions using the direct method
          try {
            // Try to get transactions with the clean ID first
            const txnData = await getClientTransactionsDirect(cleanClientId || clientId);
            setTransactions(txnData);
          } catch (txnError) {
            console.error('Error loading transactions:', txnError);
            // Don't show error here because we might not have any transactions yet
            setTransactions([]);
          }
          
          setLoading(false);
        } else {
          // No client ID, show the search or add client tab
          setActiveTab('clients');
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load client data:', err);
        setError('Failed to load client data: ' + (err.message || 'Unknown error'));
        setLoading(false);
      }
    };
    
    if (existingClients.length > 0 || clientId) {
      loadData();
    }
  }, [clientId, existingClients]);
  
  const handleClientAdded = (newClientId) => {
    // Navigate to the new client's ledger
    navigate(`/client-ledger/${newClientId}`);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const handleCreateLedger = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Manually creating ledger, current client state:', client);
      console.log('Client ID from URL:', clientId);
      
      // If client data is incomplete (likely due to a missing ledger document), try to fetch it
      if (!client || !client.name) {
        console.log('Client data is incomplete, trying to fetch from backend');
        try {
          // First try to get the complete client data from backend
          const backendClient = await getClientByPhone(clientId);
          console.log('Found client in backend:', backendClient);
          
          // Create client data object
          const clientData = {
            name: backendClient.name,
            phoneNumber: backendClient.phoneNumber,
            email: backendClient.email || '',
            _id: backendClient._id
          };
          
          const ledgerClient = await createClientLedgerFromExisting(clientData);
          console.log('Created ledger client from backend data:', ledgerClient);
          
          // Update state with the new ledger client
          setClient(ledgerClient);
          setLedgerClientId(ledgerClient.id);
          
          // Show success message
          setSuccess('Client ledger created successfully!');
          setTimeout(() => setSuccess(''), 3000);
          return;
        } catch (backendErr) {
          console.error('Failed to fetch client from backend:', backendErr);
        }
      }
      
      // If we have client data or backend fetch failed, try with what we have
      // Ensure we have the minimum required data
      const name = client?.name || 'Unknown Client';
      const phone = client?.phone || client?.phoneNumber || clientId;
      
      if (!phone) {
        setError('Cannot create ledger: Missing phone number');
        return;
      }
      
      // Create a client data object with the necessary fields
      const clientData = {
        name: name,
        phoneNumber: phone,
        email: client?.email || '',
        _id: client?.id || clientId
      };
      
      console.log('Creating ledger with data:', clientData);
      
      const ledgerClient = await createClientLedgerFromExisting(clientData);
      console.log('Manually created ledger client:', ledgerClient);
      
      // Update state with the new ledger client
      setClient(ledgerClient);
      setLedgerClientId(ledgerClient.id);
      
      // Show success message
      setSuccess('Client ledger created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error manually creating ledger:', err);
      setError('Failed to create ledger: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="client-ledger-container">
      {!clientId ? (
        <>
          <h1>Client Ledger System</h1>
          
          <div className="ledger-tabs">
            <button 
              className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              Find Client
            </button>
            <button 
              className={`tab-button ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              Select Existing Client
            </button>
          </div>
          
          {activeTab === 'search' && <ClientSearch />}
          {activeTab === 'clients' && (
            <div className="existing-clients-list">
              <h2>Select a Client</h2>
              {existingClients.length === 0 ? (
                <p>Loading clients...</p>
              ) : (
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone Number</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {existingClients.map((client) => (
                      <tr key={client._id || client.phoneNumber}>
                        <td>{client.name}</td>
                        <td>{client.phoneNumber}</td>
                        <td>{client.email}</td>
                        <td>
                          <Link 
                            to={`/client-ledger/${client.phoneNumber}`} 
                            className="view-ledger-link"
                          >
                            View Ledger
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {loading ? (
            <div className="loading">Loading client data...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : client ? (
            <>
              <div className="ledger-header">
                <div className="back-navigation">
                  <Link to="/client-ledger" className="back-button">
                    ← Back to All Clients
                  </Link>
                </div>
                
                <h1>Client Ledger: {client.name}</h1>
                
                <div className="client-info">
                  <p><strong>Phone:</strong> {client.phone || client.phoneNumber}</p>
                  {client.email && <p><strong>Email:</strong> {client.email}</p>}
                  {client.notes && <p><strong>Notes:</strong> {client.notes}</p>}
                </div>
              </div>
              
              <div className="ledger-summary">
                <div className="summary-card total">
                  <h3>Total Amount</h3>
                  <p className="amount">{formatCurrency(client.totalAmount || 0)}</p>
                  <span className="label">Total Charges</span>
                </div>
                
                <div className="summary-card received">
                  <h3>Received Amount</h3>
                  <p className="amount">{formatCurrency(client.receivedAmount || 0)}</p>
                  <span className="label">Amount Received</span>
                </div>
                
                <div className="summary-card balance">
                  <h3>Remaining Balance</h3>
                  <p className={`amount ${client.balance > 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(client.balance || 0)}
                  </p>
                  <span className="label">Amount Due</span>
                </div>
              </div>
              
              <div className="client-ledger-tabs">
                <button 
                  className={`tab-button ${activeTab === 'ledger' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ledger')}
                >
                  Ledger History
                </button>
                <button 
                  className={`tab-button ${activeTab === 'add-transaction' ? 'active' : ''}`}
                  onClick={() => setActiveTab('add-transaction')}
                >
                  Add Transaction
                </button>
              </div>
              
              {activeTab === 'ledger' && (
                <ClientLedgerTable transactions={transactions} />
              )}
              
              {activeTab === 'add-transaction' && (
                <>
                  {ledgerClientId ? (
                    <AddTransactionForm 
                      clientId={ledgerClientId} 
                      clientName={client.name} 
                    />
                  ) : (
                    <div className="ledger-missing-container" style={{ padding: '20px', border: '1px solid #f0f0f0', borderRadius: '5px', marginTop: '20px' }}>
                      <div className="error-message" style={{ marginBottom: '15px' }}>
                        <h3>Ledger Document Needed</h3>
                        <p>This client doesn't have a ledger document in the system yet. A ledger document is required before you can add transactions.</p>
                        <p><strong>Client Details:</strong></p>
                        <ul>
                          <li><strong>Name:</strong> {client?.name || 'Unknown'}</li>
                          <li><strong>Phone:</strong> {client?.phone || client?.phoneNumber || clientId || 'Unknown'}</li>
                          {client?.email && <li><strong>Email:</strong> {client.email}</li>}
                        </ul>
                      </div>
                      <button 
                        className="create-ledger-button" 
                        onClick={handleCreateLedger}
                        disabled={loading}
                        style={{ 
                          padding: '10px 15px', 
                          backgroundColor: '#007bff', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        {loading ? 'Creating Ledger...' : 'Create Ledger Document'}
                      </button>
                      {success && <div className="success-message" style={{ marginTop: '15px', color: 'green' }}>{success}</div>}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="not-found">Client not found</div>
          )}
        </>
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info" style={{ marginTop: '20px', fontSize: '12px', color: '#666', padding: '10px', backgroundColor: '#f5f5f5' }}>
          <h4>Debug Info:</h4>
          <p>Client ID param: {clientId}</p>
          <p>Ledger Client ID: {ledgerClientId}</p>
          <p>Client name: {client?.name}</p>
          <p>Client phone: {client?.phone || client?.phoneNumber}</p>
        </div>
      )}
    </div>
  );
};

export default ClientLedger; 