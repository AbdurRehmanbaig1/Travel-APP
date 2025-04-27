import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientForm from '../components/clients/ClientForm';
import ClientSearch from '../components/clients/ClientSearch';
import ClientsList from '../components/clients/ClientsList';

const ClientManagement = () => {
  return (
    <div className="client-management-container">
      <Routes>
        <Route path="/add" element={<ClientForm />} />
        <Route path="/search" element={<ClientSearch />} />
        <Route path="/list" element={<ClientsList />} />
        <Route path="/:phone" element={<ClientSearch />} />
      </Routes>
    </div>
  );
};

export default ClientManagement; 