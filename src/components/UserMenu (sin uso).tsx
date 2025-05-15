import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaUser, FaCog } from 'react-icons/fa';
import './UserMenu.css';

const UserMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="user-container" ref={menuRef}>
      <div className="user-label" onClick={() => setOpen(!open)}>
        <span>Hola, usuario</span>
        <FaUserCircle className="user-icon" />
      </div>
      {open && (
        <div className="user-dropdown">
          <Link to="/perfil"><FaUser /> Perfil</Link>
          <Link to="/ajustes"><FaCog /> Ajustes</Link>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
