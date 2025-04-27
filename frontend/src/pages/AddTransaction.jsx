import React from 'react';
import { Link } from 'react-router-dom';
import TransactionForm from '../components/finance/TransactionForm';

const AddTransaction = () => {
  return (
    <div className="add-transaction-page">
      <div className="page-header">
        <h1>Finance Management</h1>
        <Link to="/finance" className="back-to-dashboard">
          Back to Finance Dashboard
        </Link>
      </div>
      
      <div className="dashboard-section">
        <TransactionForm 
          onTransactionAdded={() => {
            // Show a success message
            alert('Transaction added successfully!');
          }} 
        />
      </div>
    </div>
  );
};

export default AddTransaction; 