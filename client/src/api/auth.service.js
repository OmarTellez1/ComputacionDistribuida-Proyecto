import axios from './axios';

export const loginRequest = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

export const registerRequest = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  return response.data;
};

export const verifyTokenRequest = async () => {
  const response = await axios.get('/auth/verify');
  return response.data;
};
