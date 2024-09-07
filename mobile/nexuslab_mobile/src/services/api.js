import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config'; 
const api = axios.create({
    baseURL: `${config.apiUrl}/api`, 
});

api.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// api.interceptors.response.use(
//     response => response,    
//     error => {
//       console.log("Erreur de réponse:", error.response);
//       return Promise.reject(error);
//     }
//   );

export default api;
