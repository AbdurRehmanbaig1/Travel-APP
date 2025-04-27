import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addClientTransaction } from '../../services/clientLedgerService';

const AddTransactionForm = ({ clientId, clientName }) => {
  const [formData, setFormData] = useState({
    type: 'total',
    amount: '',
    description: '',
    date: new Date()
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [internalClientId, setInternalClientId] = useState(null);

  // Log received clientId for debugging
  useEffect(() => {
    console.log('AddTransactionForm received clientId:', clientId);
    if (clientId) {
      setInternalClientId(clientId);
      setError('');
    } else {
      setError('Client ID is missing');
    }
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    // Ensure we have a valid date
    const validDate = date instanceof Date && !isNaN(date) ? date : new Date();
    
    setFormData({
      ...formData,
      date: validDate
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const effectiveClientId = internalClientId || clientId;
    
    if (!effectiveClientId) {
      setError('Client ID is missing. Please try refreshing the page.');
      return;
    }
    
    // Validate form
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }
    
    if (!formData.amount.trim()) {
      setError('Please enter an amount');
      return;
    }
    
    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      setError('Amount must be a positive number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log(`Adding ${formData.type} transaction for client ${effectiveClientId}: ${formData.amount}`);
      
      // Add transaction
      const success = await addClientTransaction(effectiveClientId, {
        ...formData,
        amount: Number(formData.amount),
        date: formData.date instanceof Date ? formData.date : new Date()
      });
      
      if (success) {
        setSuccess('Transaction added successfully!');
        // Reset form
        setFormData({
          type: 'total',
          amount: '',
          description: '',
          date: new Date()
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError('Failed to add transaction');
      }
    } catch (err) {
      console.error("Transaction addition error:", err);
      setError('Failed to add transaction: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form-container">
      <h2>Add New Transaction</h2>
      
      {clientName && (
        <div className="client-info-summary">
          <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
            Client: <span style={{ color: '#007bff' }}>{clientName}</span>
          </p>
          {internalClientId && <p className="client-id-debug" style={{ fontSize: '14px', color: '#666' }}>Client ID: {internalClientId}</p>}
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group form-group-half">
            <label htmlFor="type">Transaction Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="total">Total Amount</option>
              <option value="received">Received Amount</option>
            </select>
          </div>
          
          <div className="form-group form-group-half">
            <label htmlFor="amount">Amount (PKR)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-input"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter transaction description"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <DatePicker
            id="date"
            name="date"
            selected={formData.date}
            onChange={handleDateChange}
            className="form-input"
            dateFormat="MM/dd/yyyy"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading || !internalClientId}
        >
          {loading ? 'Adding Transaction...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default AddTransactionForm; 