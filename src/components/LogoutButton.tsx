import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/authSlice';
import { resetFilter } from '../redux/FilterSlice';

interface LogoutButtonProps {
  onLogout: () => void; // Define a callback function type
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Dispatch the logoutUser async thunk
      await dispatch(logoutUser());
      
      // Reset filter states
      dispatch(resetFilter());

      // Navigate after logout
      navigate('/RIP_front/employees');
      onLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleLogout}>
      Выйти
    </button>
  );
};

export default LogoutButton;
