import { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, Settings, User, LogOut, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './layout.css';

export const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [avatar] = useLocalStorage('user-avatar', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali&backgroundColor=b6e3f4');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  
  const path = location.pathname;
  let title = 'Dashboard';
  if (path.includes('/products')) title = 'Products';
  if (path.includes('/analytics')) title = 'Analytics';
  if (path.includes('/settings')) title = 'Settings';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Stock Alert: iPhone 15 Pro",
      message: "Inventory is running low (only 3 items remaining)",
      time: "5 mins ago",
      icon: AlertTriangle,
      color: "var(--warning)"
    },
    {
      id: 2,
      title: "Daily Goal Exceeded",
      message: "Daily store sales hit $5,430 (120% of goal)",
      time: "2 hours ago",
      icon: TrendingUp,
      color: "var(--success)"
    },
    {
      id: 3,
      title: "Sync Successful",
      message: "DummyJSON product library successfully synced",
      time: "4 hours ago",
      icon: CheckCircle2,
      color: "var(--accent-primary)"
    }
  ];

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
        <div className="search-bar cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search (Ctrl + K)" 
            className="search-input cursor-pointer" 
            readOnly 
          />
          <span className="search-shortcut">⌘K</span>
        </div>
        
        <div className="navbar-actions">
          <div className="relative" ref={notificationRef}>
            <button 
              className="icon-btn relative" 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ cursor: 'pointer' }}
            >
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            <div className={`dropdown-menu ${showNotifications ? 'show' : ''}`} style={{ width: '310px' }}>
              <div className="dropdown-header">Notifications</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }} className="scrollbar-thin">
                {notifications.map(n => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className="dropdown-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px', cursor: 'default', padding: '12px' }}>
                      <div className="flex items-center gap-2 w-full">
                        <Icon size={16} style={{ color: n.color, flexShrink: 0 }} />
                        <span className="font-semibold" style={{ fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 2px 24px', textAlign: 'left', lineHeight: '1.4' }}>{n.message}</p>
                      <span style={{ fontSize: '9px', color: 'var(--text-secondary)', marginLeft: '24px' }}>{n.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <ThemeToggle />
          
          <div className="relative" ref={profileRef}>
            <img 
              src={avatar} 
              alt="Profile" 
              className="nav-avatar"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{ border: '2px solid var(--border-color)', padding: '2px' }}
            />
            <div className={`dropdown-menu ${showProfileDropdown ? 'show' : ''}`} style={{ width: '180px' }}>
              <div className="dropdown-header">Anjali Gupta</div>
              <div className="dropdown-item" onClick={() => { navigate('/settings'); setShowProfileDropdown(false); }}>
                <User size={16} />
                <span>My Profile</span>
              </div>
              <div className="dropdown-item" onClick={() => { navigate('/settings'); setShowProfileDropdown(false); }}>
                <Settings size={16} />
                <span>Settings</span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
              <div className="dropdown-item" style={{ color: 'var(--danger)' }} onClick={() => alert("Logged out successfully!")}>
                <LogOut size={16} />
                <span>Log Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
