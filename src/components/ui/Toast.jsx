import React, { useState, useEffect, createContext, useContext } from 'react';
import { Package } from 'lucide-react';
import { productApi } from '../../services/productApi';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mockProducts = [];
    let interval;

    const init = async () => {
      try {
        const res = await productApi.getProducts({ limit: 30 });
        mockProducts = res.products;

        interval = setInterval(() => {
          if (mockProducts.length === 0) return;
          const randomIdx = Math.floor(Math.random() * mockProducts.length);
          const product = mockProducts[randomIdx];
          
          setToast({
            id: Date.now(),
            message: `Stock updated for ${product.title}`,
          });

          setTimeout(() => {
            setToast(null);
          }, 4000);
        }, 8000);
      } catch (err) {
        // ignore
      }
    };
    
    init();

    return () => clearInterval(interval);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toast && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            padding: '12px 16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 9999,
            animation: 'slideUp 0.3s ease forwards'
          }}
        >
          <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)', padding: '8px', borderRadius: '50%' }}>
            <Package size={16} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{toast.message}</span>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </ToastContext.Provider>
  );
};
