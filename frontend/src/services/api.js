import axios from 'axios';

// Use environment variable for API URL with fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Client API calls
export const addClient = async (clientData) => {
  try {
    const response = await axios.post(`${API_URL}/clients`, clientData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Failed to connect to server' };
  }
};

export const getClientByPhone = async (phoneNumber) => {
  try {
    const response = await axios.get(`${API_URL}/clients/${phoneNumber}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Failed to connect to server' };
  }
};

export const getAllClients = async () => {
  try {
    const response = await axios.get(`${API_URL}/clients`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Failed to connect to server' };
  }
};

// Tour API calls
export const addTour = async (tourData) => {
  try {
    const response = await axios.post(`${API_URL}/tours`, tourData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Failed to connect to server' };
  }
};

export const getAllTours = async () => {
  try {
    const response = await axios.get(`${API_URL}/tours`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Failed to connect to server' };
  }
};

export const getTourById = async (clientPhone, tourId) => {
  try {
    const response = await axios.get(`${API_URL}/tours/${clientPhone}/${tourId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Failed to connect to server' };
  }
}; 