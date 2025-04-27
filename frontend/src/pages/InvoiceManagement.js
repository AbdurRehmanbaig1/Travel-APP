import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InvoiceView from '../components/invoices/InvoiceView';

const InvoiceManagement = () => {
  return (
    <div className="invoice-management-container">
      <Routes>
        <Route path="/:clientPhone/:tourId" element={<InvoiceView />} />
      </Routes>
    </div>
  );
};

export default InvoiceManagement; 