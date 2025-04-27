import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addTour } from '../../services/api';

const TourForm = () => {
  const [formData, setFormData] = useState({
    clientPhone: '',
    clientName: '',
    clientEmail: '',
    type: 'local', // Default to local
    price: '',
    cost: '',
    peopleCount: '1',
    days: '1',
    date: new Date(),
    address: '',
    country: 'Pakistan',
    destination: '',
    description: ''
  });
  const [currency, setCurrency] = useState('PKR'); // Default to PKR for local tours
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update currency when tour type changes
  useEffect(() => {
    setCurrency(formData.type === 'local' || formData.type === 'honeymoon' ? 'PKR' : 'USD');
  }, [formData.type]);

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
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare the data for submission
      const tourData = {
        ...formData,
        currency, // Add currency to the tour data
        date: formData.date.toISOString().split('T')[0] // Format as YYYY-MM-DD
      };

      await addTour(tourData);
      setSuccess('Tour added successfully!');
      // Reset form
      setFormData({
        clientPhone: '',
        clientName: '',
        clientEmail: '',
        type: 'local',
        price: '',
        cost: '',
        peopleCount: '1',
        days: '1',
        date: new Date(),
        address: '',
        country: 'Pakistan',
        destination: '',
        description: ''
      });
      setCurrency('PKR'); // Reset currency
    } catch (err) {
      setError(err.error || 'Failed to add tour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tour-form-container">
      <h2>Pak Travel Custom Tours</h2>
      <p className="form-required-fields"><span className="required-indicator">*</span> indicates required fields</p>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">Select Your Tour Type <span className="required-indicator">*</span></label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="localTour"
                name="type"
                value="local"
                checked={formData.type === 'local'}
                onChange={handleChange}
                required
              />
              <label htmlFor="localTour">Pakistan Tour</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="internationalTour"
                name="type"
                value="international"
                checked={formData.type === 'international'}
                onChange={handleChange}
                required
              />
              <label htmlFor="internationalTour">International Tour</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="honeymoonPackage"
                name="type"
                value="honeymoon"
                checked={formData.type === 'honeymoon'}
                onChange={handleChange}
                required
              />
              <label htmlFor="honeymoonPackage">Honeymoon Package</label>
            </div>
          </div>
          <div className="form-helper-text">
            {formData.type === 'local' || formData.type === 'honeymoon' ? 'Prices will be in Pakistani Rupees (PKR)' : 'Prices will be in US Dollars (USD)'}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="peopleCount">Number of Travelers <span className="required-indicator">*</span></label>
          <input
            type="number"
            id="peopleCount"
            name="peopleCount"
            value={formData.peopleCount}
            onChange={handleChange}
            min="1"
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="days">Number of Days <span className="required-indicator">*</span></label>
          <input
            type="number"
            id="days"
            name="days"
            value={formData.days}
            onChange={handleChange}
            min="1"
            required
            className="form-input"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group form-group-half">
            <label htmlFor="clientName">Full Name <span className="required-indicator">*</span></label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group form-group-half">
            <label htmlFor="clientEmail">Email <span className="required-indicator">*</span></label>
            <input
              type="email"
              id="clientEmail"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="clientPhone">Phone Number <span className="required-indicator">*</span></label>
          <input
            type="text"
            id="clientPhone"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Address <span className="required-indicator">*</span></label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="destination">Destination/City <span className="required-indicator">*</span></label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination || ''}
            onChange={handleChange}
            required
            placeholder="Enter your desired travel destination"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Tour Date <span className="required-indicator">*</span></label>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            className="form-input date-picker"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="form-textarea"
            placeholder="Please provide any additional details about your tour requirements"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Estimated Price ({currency})</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="cost">Estimated Cost ({currency})</label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="form-input"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default TourForm; 