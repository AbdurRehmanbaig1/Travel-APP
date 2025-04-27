import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTourById, getClientByPhone } from '../../services/api';
import PDFGenerator from './PDFGenerator';

const InvoiceView = () => {
  const { clientPhone, tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get tour details
        const tourData = await getTourById(clientPhone, tourId);
        setTour(tourData);

        // Get client details
        const clientData = await getClientByPhone(clientPhone);
        setClient(clientData.client);
      } catch (err) {
        setError(err.error || 'Failed to fetch invoice details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientPhone, tourId]);

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
    return <div className="loading">Loading invoice...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!tour || !client) {
    return <div className="error-message">Invoice data not found</div>;
  }

  // Determine which currency to use
  const currency = tour.currency || (tour.type === 'local' ? 'PKR' : 'USD');

  return (
    <div className="invoice-view-container">
      <h2>Invoice</h2>
      
      <div className="invoice-actions">
        <Link to="/tours" className="back-button">Back to Tours</Link>
        <PDFGenerator tour={tour} client={client} />
      </div>
      
      <div className="invoice-content">
        <div className="invoice-header">
          <h3>Travel Agency Invoice</h3>
          <p>Invoice Date: {new Date().toLocaleDateString()}</p>
          <p>Invoice #: {tourId}</p>
        </div>
        
        <div className="invoice-client-info">
          <h4>Client Information</h4>
          <p><strong>Name:</strong> {client.name}</p>
          <p><strong>Phone:</strong> {client.phoneNumber}</p>
          <p><strong>Email:</strong> {client.email}</p>
        </div>
        
        <div className="invoice-tour-info">
          <h4>Tour Details</h4>
          <p><strong>Tour Type:</strong> {tour.type}</p>
          <p><strong>Date:</strong> {formatDate(tour.date)}</p>
          <p><strong>Number of People:</strong> {tour.peopleCount}</p>
          <p><strong>Currency:</strong> {currency}</p>
        </div>
        
        <div className="invoice-summary">
          <h4>Invoice Summary</h4>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{tour.type} Tour for {tour.peopleCount} people</td>
                <td>{formatCurrency(tour.price, currency)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="total-label">Total</td>
                <td className="total-value">{formatCurrency(tour.price, currency)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div className="invoice-footer">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView; 