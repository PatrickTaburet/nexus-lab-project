import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import { refreshTokenApi } from '../api/authApi';



export const checkTokenValidity = async (handleLogout, setIsLoggedIn, email = null) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    console.log('////check token validity/////')
    // console.log(token)
    if (token) {
      let decodedToken;
      let tokenEmail; 
      try {
        decodedToken = jwtDecode(token);
        tokenEmail = decodedToken.username; 
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        await handleLogout();
        return; 
      }
      
      if (decodedToken.exp * 1000 >= Date.now()) {
        if (email && tokenEmail !== email) {
          const newToken = await refreshAccessToken(userId);
          if (newToken) {
            await AsyncStorage.setItem('token', newToken);
            console.log("Email different : Refresh ok : new token added in localstorage");
            setIsLoggedIn(true);
            return newToken;
          } else {
            await handleLogout();
          }
        } 
        console.log('Token actuel valide');
        setIsLoggedIn(true);  
        return token;
      } else {
        const newToken = await refreshAccessToken(userId);
        if (newToken) {
          await AsyncStorage.setItem('token', newToken);
          console.log("Refresh ok : new token added in localstorage");
          setIsLoggedIn(true);
          return newToken;
        } else { 
          await handleLogout();
        }
      }
    } else  {
      console.error('Token is null or undefined');
      await handleLogout();
      return;
    }
  } catch (error) {
    console.error('Error checking token validity:', error); 
    await handleLogout();
  }
};

const refreshAccessToken = async (userId) => {
  try {
    const response = await refreshTokenApi(userId);
    const { token } = response.data;
    return token || null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};
