import React, { useState } from 'react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';

const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Chase&backgroundColor=f4b6c2"
];

export const Settings = () => {
  const [pageSize, setPageSize] = useLocalStorage('settings-page-size', '12');
  const { color, changeColor } = useTheme();
  const [avatar, setAvatar] = useLocalStorage('user-avatar', AVATARS[0]);
  const [showAvatars, setShowAvatars] = useState(false);

  return (
    <div className="flex-col gap-6" style={{ maxWidth: '800px' }}>
      <div className="page-header mb-2">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your dashboard preferences and profile.</p>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">Appearance</h3>
        <div className="flex items-center justify-between py-4 border-b border-color">
          <div>
            <h4 className="font-medium">Theme Mode</h4>
            <p className="text-sm text-secondary">Switch between Bright and Dull mode.</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <h4 className="font-medium">Theme Color</h4>
            <p className="text-sm text-secondary">Choose your primary accent color.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => changeColor('blue')}
              className="rounded-full"
              style={{ width: '32px', height: '32px', backgroundColor: '#4F46E5', border: color === 'blue' ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer' }}
              title="Blue"
            />
            <button 
              onClick={() => changeColor('purple')}
              className="rounded-full"
              style={{ width: '32px', height: '32px', backgroundColor: '#9333EA', border: color === 'purple' ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer' }}
              title="Purple"
            />
            <button 
              onClick={() => changeColor('emerald')}
              className="rounded-full"
              style={{ width: '32px', height: '32px', backgroundColor: '#10B981', border: color === 'emerald' ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer' }}
              title="Emerald"
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">Dashboard Preferences</h3>
        <div className="flex items-center justify-between py-4 border-b border-color">
          <div>
            <h4 className="font-medium">Default Page Size</h4>
            <p className="text-sm text-secondary">Number of products per page.</p>
          </div>
          <select 
            className="input" 
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          >
            <option value="12">12 Items</option>
            <option value="24">24 Items</option>
            <option value="48">48 Items</option>
          </select>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">Profile</h3>
        <div className="flex items-center gap-6">
          <img 
            src={avatar} 
            alt="Anjali Gupta" 
            className="rounded-full"
            style={{ width: '80px', height: '80px', objectFit: 'cover', border: '2px solid var(--border-color)' }}
          />
          <div>
            <h4 className="font-medium text-lg mb-3 text-primary">Anjali Gupta</h4>
            
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => setShowAvatars(!showAvatars)}
              style={{ cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)' }}
            >
              {showAvatars ? 'Close' : 'Change Avatar'}
            </button>
          </div>
        </div>

        {showAvatars && (
          <div className="mt-6 p-4 border border-color rounded-lg" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', marginTop: '24px' }}>
            <h4 className="font-medium mb-3 text-sm text-secondary" style={{ marginBottom: '12px' }}>Select an Avatar</h4>
            <div className="flex gap-4 flex-wrap">
              {AVATARS.map((av, idx) => (
                <img 
                  key={idx}
                  src={av}
                  alt={`Avatar Option ${idx + 1}`}
                  onClick={() => setAvatar(av)}
                  className="rounded-full"
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    border: avatar === av ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    opacity: avatar === av ? 1 : 0.6,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = avatar === av ? 1 : 0.6}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
