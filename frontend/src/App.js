import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import ClientForm from './components/clients/ClientForm';
import ClientSearch from './components/clients/ClientSearch';
import ClientsList from './components/clients/ClientsList';
import TourForm from './components/tours/TourForm';
import ToursList from './components/tours/ToursList';
import InvoiceView from './components/invoices/InvoiceView';
import FinanceDashboard from './pages/FinanceDashboard';
import AddTransaction from './pages/AddTransaction';
import ClientLedger from './pages/ClientLedger';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomePage />} />
          
          {/* Client Routes */}
          <Route path="/add-client" element={<ClientForm />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/search-client" element={<ClientSearch />} />
          <Route path="/client/:phone" element={<ClientSearch />} />
          
          {/* Client Ledger Routes */}
          <Route path="/client-ledger" element={<ClientLedger />} />
          <Route path="/client-ledger/:clientId" element={<ClientLedger />} />
          
          {/* Tour Routes */}
          <Route path="/add-tour" element={<TourForm />} />
          <Route path="/tours" element={<ToursList />} />
          
          {/* Finance Routes */}
          <Route path="/finance" element={<FinanceDashboard />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          
          {/* Invoice Routes */}
          <Route path="/invoice/:clientPhone/:tourId" element={<InvoiceView />} />
          
          {/* 404 Route */}
          <Route path="*" element={<div className="not-found">Page Not Found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
