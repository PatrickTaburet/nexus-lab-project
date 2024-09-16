import axios from 'axios';
import config from '../config/config';


const api = axios.create({
    baseURL: `${config.apiUrl}/api`,
  });

export const refreshTokenApi = async (userId) => {
    try {
      return response = await api.post('/refresh_token', { userId: userId }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) { 
      console.error('Refresh token request error:', error);
      throw error; 
    }
  };

  export const signup = async (userData) => {
    try {
      return response = await api.post('/add_user', userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };