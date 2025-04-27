import React, { useState } from 'react';
import { searchClientLedgers } from '../../services/clientLedgerService';
import { Link } from 'react-router-dom';

const ClientSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setLoading(true);
    setError('');
    setSearched(true);
    
    try {
      const results = await searchClientLedgers(searchTerm);
      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
      setError('Failed to search clients: ' + (err.message || 'Unknown error'));
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="client-search-container">
      <h2>Find Client</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            id="searchTerm"
            name="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            placeholder="Enter search term"
            required
          />
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {loading && <p>Loading...</p>}

      {searched && searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results</h3>
          <ul>
            {searchResults.map((result) => (
              <li key={result.id}>
                <Link to={`/client-ledger/${result.id}`}>{result.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searched && searchResults.length === 0 && (
        <p>No clients found.</p>
      )}
    </div>
  );
};

export default ClientSearch; 