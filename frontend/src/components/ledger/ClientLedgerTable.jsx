import React from 'react';

const ClientLedgerTable = ({ transactions }) => {
  const formatDate = (date) => {
    try {
      if (!date) return 'N/A';
      // Handle both Date objects and ISO strings
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Date formatting error:", error, date);
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error("Currency formatting error:", error, amount);
      return "PKR 0.00";
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="no-transactions">
        <p>No transactions found.</p>
      </div>
    );
  }

  console.log("Transactions received:", transactions);

  // Calculate running balance for each transaction
  let runningBalance = 0;
  const transactionsWithBalance = [...transactions]
    .sort((a, b) => {
      // Safely handle different date formats
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateA - dateB;
    })
    .map(txn => {
      const amount = Number(txn.amount) || 0;
      
      // Total Amount is positive (receivable from client)
      // Received Amount is negative (received from client)
      if (txn.type === 'total') {
        runningBalance += amount;
      } else if (txn.type === 'received') {
        runningBalance -= amount;
      }
      
      return {
        ...txn,
        runningBalance
      };
    })
    .reverse(); // Reverse to show newest first

  return (
    <div className="ledger-table-container">
      <h2>Transaction History</h2>
      <table className="ledger-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Total Amount</th>
            <th>Received Amount</th>
            <th>Remaining Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactionsWithBalance.map((transaction) => (
            <tr key={transaction.id}>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.description}</td>
              <td className="total-amount">
                {transaction.type === 'total' ? formatCurrency(transaction.amount) : '-'}
              </td>
              <td className="received-amount">
                {transaction.type === 'received' ? formatCurrency(transaction.amount) : '-'}
              </td>
              <td className={transaction.runningBalance > 0 ? 'positive-balance' : 'negative-balance'}>
                {formatCurrency(Math.abs(transaction.runningBalance))}
                {transaction.runningBalance > 0 ? ' Due' : ' Overpaid'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientLedgerTable; 