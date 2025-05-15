import React from 'react';
import logo from '../assets/teleton-logo.png';
import UserMenu from './UserMenu (sin uso)';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="login-header">
      <img src={logo} alt="Teletón" className="login-logo" />
      <UserMenu />
    </header>
  );
};

export default Header;
