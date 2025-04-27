import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TourForm from '../components/tours/TourForm';
import ToursList from '../components/tours/ToursList';

const TourManagement = () => {
  return (
    <div className="tour-management-container">
      <Routes>
        <Route path="/add" element={<TourForm />} />
        <Route path="/list" element={<ToursList />} />
      </Routes>
    </div>
  );
};

export default TourManagement; 