import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <>
      <div className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <img src="/Paklogo.png" alt="Pak Travel Logo" className="nav-logo" />
            <div className="logo-text">
              <span>Pak</span>
              <span>Travel</span>
            </div>
          </Link>
        </div>
        
        <div className="sidebar-content">
          <ul className="sidebar-nav">
            <li className="nav-item">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="nav-icon home-icon"></i>
                <span className="nav-text">Home</span>
              </NavLink>
            </li>
            
            <li className="nav-item has-submenu">
              <div className="nav-header">
                <i className="nav-icon clients-icon"></i>
                <span className="nav-text">Clients</span>
              </div>
              <ul className="submenu">
                <li>
                  <NavLink to="/add-client" className={({ isActive }) => isActive ? 'active' : ''}>
                    Add Client
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/clients" className={({ isActive }) => isActive ? 'active' : ''}>
                    All Clients
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/search-client" className={({ isActive }) => isActive ? 'active' : ''}>
                    Search Client
                  </NavLink>
                </li>
              </ul>
            </li>
            
            <li className="nav-item has-submenu">
              <div className="nav-header">
                <i className="nav-icon tours-icon"></i>
                <span className="nav-text">Tours</span>
              </div>
              <ul className="submenu">
                <li>
                  <NavLink to="/add-tour" className={({ isActive }) => isActive ? 'active' : ''}>
                    Add Tour
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/tours" className={({ isActive }) => isActive ? 'active' : ''}>
                    All Tours
                  </NavLink>
                </li>
              </ul>
            </li>
            
            <li className="nav-item has-submenu">
              <div className="nav-header">
                <i className="nav-icon finance-icon"></i>
                <span className="nav-text">Finance</span>
              </div>
              <ul className="submenu">
                <li>
                  <NavLink to="/finance" className={({ isActive }) => isActive ? 'active' : ''}>
                    Finance Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/add-transaction" className={({ isActive }) => isActive ? 'active' : ''}>
                    Add Transaction
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/client-ledger" className={({ isActive }) => isActive ? 'active' : ''}>
                    Client Ledger
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="navbar-mobile">
        <div className="mobile-brand">
          <Link to="/" className="logo">
            <img src="/Paklogo.png" alt="Pak Travel Logo" className="nav-logo-small" />
            <div className="logo-text">
              <span>Pak</span>
              <span>Travel</span>
            </div>
          </Link>
        </div>
        <button className="menu-toggle-mobile" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '×' : '☰'}
        </button>
      </div>
    </>
  );
};

export default Navbar; 