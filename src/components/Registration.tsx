import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthToken, setUsername } from '../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import axios from 'axios';

const RegistrationPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  const [email, setLogin] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const closeError = () => {
    setError(null);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });



      // Обработка Set-Cookie заголовка
      const sessionKey = response.data.session_key;
      const username = response.data.username;
      dispatch(setAuthToken(sessionKey));
      dispatch(setUsername(username));
      if (response.status === 201) {
        navigate('/RIP_front/login/');
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
      console.error('Ошибка регистрации:', error);
      setError('Такой логин уже существует'); // Set error message

      // Automatically clear the error after 5 seconds
      setTimeout(() => {
        closeError();
      }, 1000);
    }
  };

  //     // Дополнительные действия после успешной аутентификации
  //   } catch (error) {
  //     // Обработка ошибок, например, вывод сообщения об ошибке
  //     console.error('Error during login:', error);
  //   }
  // };

  return (
    <div className="centered-container">
      <form className="vertical-form">
        <div className="button-container">
          <input
            className="rounded-input"
            placeholder="Имя"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input
            className="rounded-input"
            placeholder="Email"
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
            Зарегистрироваться
          </button>
          
          <Link to="/RIP_front/login" className="btn btn-primary">
            Уже есть аккаунт?
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
  );
};

export default RegistrationPage;
