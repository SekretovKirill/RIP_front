// registrationActions.js
import axios from 'axios';

import { loginUser } from './authActions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// registrationActions.js
export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:8000/users/registration/', userData);

    // Print cookies to the console
    console.log('Cookies:', document.cookie);

    dispatch(loginUser(userData.username, userData.password));
    toast.success('Регистрация успешна');
  } catch (error) {
    console.error('Ошибка при регистрации:', error.response.data);
    toast.error('Ошибка при регистрации. Подробности в консоли.');
  }
};

