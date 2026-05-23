import React from 'react';
import './ui.css';

export const Button = React.memo(({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
      {children}
    </button>
  );
});
