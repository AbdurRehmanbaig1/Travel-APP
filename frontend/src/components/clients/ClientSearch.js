import React, { useState } from 'react';
import { getClientByPhone } from '../../services/api';
import ClientToursList from './ClientToursList';

const ClientSearch = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [client, setClient] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    setClient(null);
    setTours([]);
    
    try {
      const data = await getClientByPhone(phoneNumber);
      setClient(data.client);
      setTours(data.tours);
    } catch (err) {
      setError(err.error || 'Failed to find client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-search-container">
      <h2>Search Client by Phone Number</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      
      {client && (
        <div className="client-details">
          <h3>Client Details</h3>
          <div className="details-row">
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Phone:</strong> {client.phoneNumber}</p>
            <p><strong>Email:</strong> {client.email}</p>
          </div>
          
          <ClientToursList tours={tours} />
        </div>
      )}
    </div>
  );
};

export default ClientSearch; 