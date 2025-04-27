import React, { useState } from 'react';
import { addClientLedger } from '../../services/clientLedgerService';

const AddClientForm = ({ onClientAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    initialAmount: '',
    initialDescription: 'Initial Balance',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Please enter client name');
      return;
    }
    
    if (!formData.phone.trim()) {
      setError('Please enter phone number');
      return;
    }
    
    if (formData.initialAmount && (isNaN(Number(formData.initialAmount)) || Number(formData.initialAmount) < 0)) {
      setError('Initial amount must be a positive number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Add client ledger
      const clientId = await addClientLedger(formData);
      
      // Show success message
      setSuccess('Client added successfully!');
      
      // Reset the form
      setFormData({
        name: '',
        phone: '',
        initialAmount: '',
        initialDescription: 'Initial Balance',
        notes: ''
      });
      
      // Call the callback function
      if (onClientAdded) {
        onClientAdded(clientId);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error("Client addition error:", err);
      setError('Failed to add client: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-form-container">
      <h2>Add New Client</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group form-group-half">
            <label htmlFor="name">Client Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter client name"
              required
            />
          </div>
          
          <div className="form-group form-group-half">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group form-group-half">
            <label htmlFor="initialAmount">Initial Amount</label>
            <input
              type="number"
              id="initialAmount"
              name="initialAmount"
              value={formData.initialAmount}
              onChange={handleChange}
              className="form-input"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="form-group form-group-half">
            <label htmlFor="initialDescription">Description</label>
            <input
              type="text"
              id="initialDescription"
              name="initialDescription"
              value={formData.initialDescription}
              onChange={handleChange}
              className="form-input"
              placeholder="Initial amount description"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Add any additional details about the client..."
            rows="3"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading}
        >
          {loading ? 'Adding Client...' : 'Add Client'}
        </button>
      </form>
    </div>
  );
};

export default AddClientForm; 