// Header.tsx
import React from 'react';
import '../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header>
      <a href="/RIP_front/employees">
        <img src="/logo.jpg" alt="Логотип" className="logo" />
      </a>
      <div className="header-title">
        <h1>BMSTU</h1>
      </div>
    </header>
  );
};

export default Header;
