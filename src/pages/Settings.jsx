import React from 'react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const Settings = () => {
  const [pageSize, setPageSize] = useLocalStorage('settings-page-size', '12');

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
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali&backgroundColor=b6e3f4" 
            alt="Anjali Gupta" 
            className="rounded-full"
            style={{ width: '80px', height: '80px' }}
          />
          <div>
            <h4 className="font-medium text-lg">Anjali Gupta</h4>
            <p className="text-secondary mb-2">Frontend Intern</p>
            <button className="btn btn-outline btn-sm">Change Avatar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
