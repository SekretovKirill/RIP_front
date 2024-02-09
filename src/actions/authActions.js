// authActions.js

import axios from 'axios';
import { loginSuccess } from '../slices/authSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const loginUser = (username, password) => async (dispatch) => {
  try {
    console.log('Attempting login with:', username, password);
    const response = await axios.post(
      'http://localhost:8000/users/login/',
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );

    console.log('Login successful. Response:', response.data);
    console.log('Cookies:', document.cookie);

    dispatch(loginSuccess({ user: response.data }));
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    toast.error('Неверный логин или пароль');
    throw error;
  }
};



// authActions.js

export const logoutUser = () => async (dispatch, getState) => {
  try {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      return;
    }

    const { bucket } = getState();
    const draft_id = bucket.draft_id;

    if (draft_id) {
      await axios.delete(
        `http://localhost:8000/request/user/delete/${draft_id}/put/`,
        {
          withCredentials: true, // Include credentials in the request
        }
      );
    }

    const response = await axios.get('http://localhost:8000/users/logout/', {
      withCredentials: true, // Include credentials in the request
    });

    if (response.status === 200) {
      dispatch(resetBucket());
      dispatch(logoutSuccess());
      toast.success('Выход выполнен успешно');
    } else {
      toast.error('Ошибка при выходе');
    }
  } catch (error) {
    console.error('Error during logout:', error);

    if (error.response && error.response.status === 401) {
      console.warn('User not authenticated');
    } else {
      toast.error('Ошибка при выходе');
    }
  }
};
