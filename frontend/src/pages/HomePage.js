import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Travel Agency Management System</h1>
        <p className="welcome-message">
          Welcome to your complete travel agency solution. 
          Manage clients, tours, and finances all in one place.
        </p>
      </div>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-icon client-icon"></div>
          <h2>Client Management</h2>
          <p className="card-description">
            Add, search, and manage client records for your travel agency.
          </p>
          <div className="card-links">
            <Link to="/add-client" className="card-link">Add New Client</Link>
            <Link to="/clients" className="card-link">View All Clients</Link>
            <Link to="/search-client" className="card-link">Search Client</Link>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon tour-icon"></div>
          <h2>Tour Management</h2>
          <p className="card-description">
            Create and track tours for your clients.
          </p>
          <div className="card-links">
            <Link to="/add-tour" className="card-link">Add New Tour</Link>
            <Link to="/tours" className="card-link">View All Tours</Link>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon finance-icon"></div>
          <h2>Finance Management</h2>
          <p className="card-description">
            Track income, expenses, and monitor your financial status.
          </p>
          <div className="card-links">
            <Link to="/finance" className="card-link">Finance Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 