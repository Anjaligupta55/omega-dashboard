import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import './layout.css';

export const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const path = location.pathname;
  
  let title = 'Dashboard';
  if (path.includes('/products')) title = 'Products';
  if (path.includes('/analytics')) title = 'Analytics';
  if (path.includes('/settings')) title = 'Settings';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="page-title">
          <h1>{title}</h1>
          <span className="breadcrumb">Pages / {title}</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search anywhere..." className="search-input" />
        </div>
        
        <div className="navbar-actions">
          <button className="icon-btn relative">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          <ThemeToggle />
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali&backgroundColor=b6e3f4" 
            alt="Profile" 
            className="nav-avatar"
          />
        </div>
      </div>
    </header>
  );
};
