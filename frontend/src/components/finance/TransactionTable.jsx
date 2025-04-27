import React from 'react';

const TransactionTable = ({ transactions }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="no-transactions">
        <p>No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="transactions-table-container">
      <h2>Transaction History</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr 
              key={transaction.id}
              className={transaction.type === 'income' ? 'income-row' : 'expense-row'}
            >
              <td>{transaction.title}</td>
              <td className={transaction.type === 'income' ? 'income-amount' : 'expense-amount'}>
                {formatCurrency(Number(transaction.amount))}
              </td>
              <td>
                <span className={`transaction-type ${transaction.type}`}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </span>
              </td>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable; 