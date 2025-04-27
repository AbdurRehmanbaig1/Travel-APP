import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClientLedgers } from '../../services/clientLedgerService';

const ClientLedgerList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const data = await getClientLedgers();
        setClients(data);
      } catch (err) {
        console.error('Failed to load clients:', err);
        setError('Failed to load clients: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="client-ledger-list">
      {loading ? (
        <div className="loading">Loading clients...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : clients.length > 0 ? (
        <ul>
          {clients.map((client) => (
            <li key={client.id}>
              <Link to={`/client-ledger/${client.id}`}>{client.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="not-found">No clients found</div>
      )}
    </div>
  );
};

export default ClientLedgerList; 