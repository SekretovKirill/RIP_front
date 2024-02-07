// Header.tsx
import '../styles/Header.css';
import React, { useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import logoImage from '../logo.jpg';
import LogoutButton from './LogoutButton';
import { RootState } from '../redux/store';



const Header: React.FC = () => {
  const navigateTo = useNavigate();


  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.name);
  const user_role = useSelector((state: RootState) => state.auth.role);
  // const searchValue = useSelector((state: RootState) => state.searchBouquets.searchText);
  // const priceValue = useSelector((state: RootState) => state.searchBouquets.price);

  const handleLoginClick = () => {
    navigateTo('/RIP_front/login/');
  };

  const handleBouquetsClick = () => {
    navigateTo('/RIP_front/employees/');
  };


  const handleApplicationstClick = () => {
    navigateTo('/RIP_front/requests/');
  };

  const handleModeratorClick = () => {
    navigateTo('/RIP_front/moderator/employees/');
  };


  const handleLogoutClick = () => {
    // Call fetchBouquets when LogoutButton is clicked
    navigateTo('/RIP_front/employees/')
  };

  useEffect(() => {
  }, []);


  return (
    <header>
    <a href="/RIP_front/employees">
      <img src={logoImage} alt="Логотип" className="logo" />
    </a>
    <span className="btn btn-primary" onClick={handleBouquetsClick}>
        Все сотрудники
      </span>
    {!isUserLoggedIn && (
      <div style = {{ marginLeft: 'auto', textAlign: 'right'}} >
        <button className="btn btn-primary" style = {{ marginLeft: 'auto', textAlign: 'right'}} onClick={handleLoginClick}>
          Войти
        </button>
      </div>
    )}

    {isUserLoggedIn && user_role === 'Admin' && (
        <div className="text-and-button">
          <span className="btn btn-primary" onClick={handleModeratorClick}>
            Редактирование сотрудников
          </span>
        </div>
        )}

    {isUserLoggedIn && (
      <div>
        <span className="btn btn-primary" onClick={handleApplicationstClick}>
          Заявки
        </span>
      </div>
    )}

    {isUserLoggedIn && (
        <div className="text-and-button" style = {{ marginLeft: 'auto', textAlign: 'right'}}>
          <p>{username}</p>
          <LogoutButton onLogout={handleLogoutClick} /> {/* Pass the callback function */}
        </div>
      )}
  </header>
  );
};

export default Header;
