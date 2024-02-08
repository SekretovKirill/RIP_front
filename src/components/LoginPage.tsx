import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthToken, setUsername, setUser_role, setIsAuthenticated, setUser_id} from '../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const closeError = () => {
    setError(null);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      const sessionKey = response.data.session_key;
      const username = response.data.name;
      const user_role = response.data.role;
      const id = response.data.id;
      dispatch(setAuthToken(sessionKey));
      dispatch(setUsername(username));
      dispatch(setUser_role(user_role));
      dispatch(setIsAuthenticated(''));
      dispatch(setUser_id(id));
      // axios.defaults.headers.common['Authorization'] = `Bearer ${sessionKey}`;

      // Check for status 200 and redirect
      if (response.status === 200) {
        navigate('/RIP_front/employees/');
      } else {
        // Handle other status codes
        console.error('Login unsuccessful. Status:', response.status);
        setError('Login unsuccessful. Please try again.'); // Set error message

        // Automatically clear the error after 5 seconds
        setTimeout(() => {
          closeError();
        }, 1000);
      }

    } catch (error) {
      console.error('Error during login:', error);
      setError('Неверный логин или пароль'); // Set error message

      // Automatically clear the error after 5 seconds
      setTimeout(() => {
        closeError();
      }, 1000);
    }
  };

  return (
    <div>
    <div className="centered-container">
      <form className="vertical-form">
        <div className="button-container">
          <input
            className="rounded-input"
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setLogin(e.target.value)}
          />
          <br />
          <input
            className="rounded-input"
            placeholder="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="btn btn-primary" type="button" onClick={handleLogin}>
            Войти
          </button>
          <Link to="/RIP_front/register" className="btn btn-primary">
            Зарегистрироваться
          </Link>
        </div>
      </form>
      {error && (
        <div className="error-modal">
          <div className="modal-content">
            <span className="close" onClick={closeError}>&times;</span>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default LoginPage;
