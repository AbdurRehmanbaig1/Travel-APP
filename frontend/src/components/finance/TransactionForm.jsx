import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addTransaction } from '../../services/financeService';

const TransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'income', // Default to income
    date: new Date(),
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

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    if (!formData.title.trim()) {
      setError('Please enter a transaction title');
      return;
    }
    
    if (!formData.amount) {
      setError('Please enter an amount');
      return;
    }
    
    // Make sure amount is a valid number
    const amount = Number(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be a positive number');
      return;
    }
    
    // Make sure date is valid
    if (!formData.date || !(formData.date instanceof Date) || isNaN(formData.date.getTime())) {
      setError('Please select a valid date');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create a clean data object to send
      const transactionData = {
        title: formData.title.trim(),
        amount: amount,
        type: formData.type,
        date: formData.date,
        notes: formData.notes.trim()
      };
      
      // Add transaction to Firestore
      await addTransaction(transactionData);
      
      // Show success message
      setSuccess('Transaction added successfully!');
      
      // Reset the form
      setFormData({
        title: '',
        amount: '',
        type: 'income',
        date: new Date(),
        notes: ''
      });
      
      // Call the callback function to refresh the transactions list
      if (onTransactionAdded) {
        onTransactionAdded();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error("Transaction error:", err);
      setError('Failed to add transaction: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form-container">
      <h2>Add New Transaction</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group form-group-half">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Transaction title"
              required
            />
          </div>
          
          <div className="form-group form-group-half">
            <label htmlFor="amount">Amount *</label>
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
        
        <div className="form-row">
          <div className="form-group form-group-half">
            <label>Transaction Type *</label>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="income"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                />
                <label htmlFor="income">Income</label>
              </div>
              
              <div className="radio-option">
                <input
                  type="radio"
                  id="expense"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                />
                <label htmlFor="expense">Expense</label>
              </div>
            </div>
          </div>
          
          <div className="form-group form-group-half">
            <label htmlFor="date">Date *</label>
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              className="form-input date-picker"
              dateFormat="MM/dd/yyyy"
              id="date"
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
            placeholder="Add any additional details..."
            rows="3"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm; 