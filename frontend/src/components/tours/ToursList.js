import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTours } from '../../services/api';

const ToursList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getAllTours();
        setTours(data);
      } catch (err) {
        setError(err.error || 'Failed to fetch tours');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format currency based on tour type
  const formatCurrency = (amount, currencyType) => {
    if (currencyType === 'PKR') {
      return `PKR ${amount.toFixed(2)}`;
    } else {
      return `$${amount.toFixed(2)}`;
    }
  };

  if (loading) {
    return <div className="loading">Loading tours...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Calculate total profit in USD and PKR separately
  const calculateTotalProfit = () => {
    const totals = {
      USD: 0,
      PKR: 0
    };

    tours.forEach(tour => {
      const currency = tour.currency || (tour.type === 'local' ? 'PKR' : 'USD');
      totals[currency] += tour.profit;
    });

    return totals;
  };

  const profitTotals = calculateTotalProfit();

  return (
    <div className="tours-list-container">
      <h2>All Tours</h2>
      
      {tours.length === 0 ? (
        <p>No tours found. <Link to="/add-tour">Add a tour</Link></p>
      ) : (
        <>
          <table className="tours-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Phone</th>
                <th>Tour Type</th>
                <th>Date</th>
                <th>People</th>
                <th>Price</th>
                <th>Cost</th>
                <th>Profit</th>
                <th>Currency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => {
                // Determine the correct currency
                const currency = tour.currency || (tour.type === 'local' ? 'PKR' : 'USD');
                
                return (
                  <tr key={tour.id}>
                    <td>{tour.clientName}</td>
                    <td>{tour.clientPhone}</td>
                    <td>{tour.type}</td>
                    <td>{formatDate(tour.date)}</td>
                    <td>{tour.peopleCount}</td>
                    <td>{formatCurrency(tour.price, currency)}</td>
                    <td>{formatCurrency(tour.cost, currency)}</td>
                    <td>{formatCurrency(tour.profit, currency)}</td>
                    <td>{currency}</td>
                    <td>
                      <Link to={`/invoice/${tour.clientPhone}/${tour.id}`} className="view-invoice-link">
                        View Invoice
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="7" className="total-label">Total Profit</td>
                <td colSpan="3" className="total-value">
                  {profitTotals.USD > 0 && <div>${profitTotals.USD.toFixed(2)}</div>}
                  {profitTotals.PKR > 0 && <div>PKR {profitTotals.PKR.toFixed(2)}</div>}
                </td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  );
};

export default ToursList; 