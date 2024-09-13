import axios from 'axios';
import config from '../config/config';


const api = axios.create({
    baseURL: `${config.apiUrl}/api`,
  });

export const refreshTokenApi = async (username) => {
    try {

      return response = await api.post('/refresh_token', { username: username }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) { 
      console.error('Refresh token request error:', error);
      throw error; 
    }
  };