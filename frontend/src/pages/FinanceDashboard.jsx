import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import TransactionTable from '../components/finance/TransactionTable';
import { getTransactions, calculateTotals } from '../services/financeService';
import { testFirebaseConnectivity } from '../utils/firebaseUtils';

const FinanceDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null);
  
  // Filter states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // Test Firebase connectivity when component mounts
  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        const results = await testFirebaseConnectivity();
        setConnectionStatus(results);
        
        if (!results.success) {
          setError(`Firebase connectivity issue: ${results.errors.join(', ')}`);
        }
      } catch (err) {
        console.error('Failed to check Firebase connectivity:', err);
        setConnectionStatus({
          success: false,
          errors: [err.message || 'Unknown error checking connectivity']
        });
      }
    };
    
    checkConnectivity();
  }, []);

  // Fetch transactions from Firestore
  const fetchTransactions = async (filters = {}) => {
    setLoading(true);
    try {
      // Only attempt to fetch if connectivity test passed
      if (connectionStatus && connectionStatus.success) {
        const data = await getTransactions(filters);
        setTransactions(data);
        
        // Calculate totals from the fetched transactions
        const calculatedTotals = calculateTotals(data);
        setTotals(calculatedTotals);
      } else {
        // If connectivity failed, show the error but don't try to fetch
        console.warn('Not fetching transactions due to failed connectivity test');
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Failed to load transactions: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch when connectionStatus changes
  useEffect(() => {
    if (connectionStatus) {
      fetchTransactions();
    }
  }, [connectionStatus]);

  // Apply date filters
  const applyFilters = () => {
    if (startDate && endDate) {
      fetchTransactions({ startDate, endDate });
      setIsFilterApplied(true);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setIsFilterApplied(false);
    fetchTransactions();
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="finance-dashboard-container">
      <div className="page-header">
        <h1>Finance Dashboard</h1>
        <div className="finance-actions">
          <Link to="/add-transaction" className="add-transaction-button">
            Add New Transaction
          </Link>
          <Link to="/client-ledger" className="client-ledger-button">
            Client Ledger System
          </Link>
        </div>
      </div>
      
      {connectionStatus && !connectionStatus.success && (
        <div className="error-message">
          <p><strong>Firebase Connection Issue:</strong> The system is having trouble connecting to the database.</p>
          <ul>
            {connectionStatus.errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Financial Summary Widgets */}
      <div className="financial-summary">
        <div className="summary-widget income">
          <h3>Total Income</h3>
          <p className="amount">{formatCurrency(totals.income)}</p>
        </div>
        
        <div className="summary-widget expense">
          <h3>Total Expenses</h3>
          <p className="amount">{formatCurrency(totals.expense)}</p>
        </div>
        
        <div className="summary-widget balance">
          <h3>Current Balance</h3>
          <p className={`amount ${totals.balance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(totals.balance)}
          </p>
        </div>
      </div>
      
      {/* Date Filter */}
      <div className="filter-section">
        <h2>Filter Transactions</h2>
        <div className="filter-controls">
          <div className="filter-group">
            <label>Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="date-picker"
            />
          </div>
          
          <div className="filter-group">
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
              className="date-picker"
            />
          </div>
          
          <div className="filter-buttons">
            <button 
              className="filter-button apply" 
              onClick={applyFilters}
              disabled={!startDate || !endDate}
            >
              Apply Filter
            </button>
            
            {isFilterApplied && (
              <button className="filter-button reset" onClick={resetFilters}>
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Transaction Table */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Transaction History</h2>
          <div className="section-actions">
            <Link to="/add-transaction" className="add-button">
              Add Transaction
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : (
          <TransactionTable transactions={transactions} />
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard; 