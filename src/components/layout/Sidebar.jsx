import { useState } from 'react';
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
  const [showHoverCard, setShowHoverCard] = useState(false);
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

        <div className="sidebar-footer" style={{ position: 'relative' }}>
          {showHoverCard && (
            <div 
              style={{ 
                position: 'absolute', 
                bottom: '76px', 
                left: '16px', 
                right: '16px', 
                zIndex: 100, 
                padding: '16px', 
                borderRadius: '16px', 
                border: '1px solid var(--border-color)', 
                backgroundColor: 'var(--card-bg)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="flex items-center gap-3">
                <img src={avatar} className="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                <div>
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Anjali Gupta</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Frontend Intern</p>
                </div>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />
              <div className="flex justify-between items-center" style={{ fontSize: '11px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                <span style={{ color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span> Online
                </span>
              </div>
              <button 
                onClick={() => { navigate('/settings'); setShowHoverCard(false); }} 
                className="btn btn-primary btn-sm w-full"
                style={{ width: '100%', padding: '6px', fontSize: '12px' }}
              >
                Profile Settings
              </button>
            </div>
          )}
          <div 
            className="profile-section"
            onMouseEnter={() => setShowHoverCard(true)}
            onMouseLeave={() => setShowHoverCard(false)}
          >
            <div className="avatar-container">
              <img 
                src={avatar} 
                alt="Anjali Gupta" 
                className="avatar"
              />
              <span className="online-indicator"></span>
            </div>
            <div className="profile-info cursor-pointer" onClick={() => navigate("/settings")}>
              <span className="profile-name">Anjali Gupta</span>  
            </div>
            <Settings 
              size={16} 
              className="text-secondary cursor-pointer" 
              onClick={(e) => { e.stopPropagation(); navigate("/settings"); }} 
            />
          </div>
        </div>
      </aside>
    </>
  );
};
