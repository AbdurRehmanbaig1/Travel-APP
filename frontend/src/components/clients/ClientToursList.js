import React from 'react';
import { Link } from 'react-router-dom';

const ClientToursList = ({ tours }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateTotalProfit = () => {
    return tours.reduce((total, tour) => total + tour.profit, 0);
  };

  return (
    <div className="client-tours-list">
      <h3>Client Tours</h3>
      
      {tours.length === 0 ? (
        <p>No tours found for this client.</p>
      ) : (
        <>
          <table className="tours-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>People</th>
                <th>Price</th>
                <th>Cost</th>
                <th>Profit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id}>
                  <td>{tour.type}</td>
                  <td>{formatDate(tour.date)}</td>
                  <td>{tour.peopleCount}</td>
                  <td>${tour.price.toFixed(2)}</td>
                  <td>${tour.cost.toFixed(2)}</td>
                  <td>${tour.profit.toFixed(2)}</td>
                  <td>
                    <Link to={`/invoice/${tour.clientPhone}/${tour.id}`} className="view-invoice-link">
                      View Invoice
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="total-label">Total Profit</td>
                <td colSpan="2" className="total-value">${calculateTotalProfit().toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  );
};

export default ClientToursList; 