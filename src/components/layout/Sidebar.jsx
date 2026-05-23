import React from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart2, Settings } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './layout.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate=useNavigate();
  const [avatar] = useLocalStorage('user-avatar', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali&backgroundColor=b6e3f4');
  return (
    <>
    
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src="/logo.png" alt="Logo" className="cursor-pointer logo-icon" onClick={() => navigate("/")} />
            <span className="logo-text cursor-pointer" onClick={() => navigate("/")}>Alpha Dashboard</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-section">
            <img 
              src={avatar} 
              alt="Anjali Gupta" 
              className="avatar"
            />
            <div className="profile-info cursor-pointer" onClick={() => navigate("/settings")}>
              <span className="profile-name">Anjali Gupta</span>  
              
            </div>
            <Settings size={16} className="text-secondary cursor-pointer" />
          </div>
        </div>
      </aside>
    </>
  );
};
