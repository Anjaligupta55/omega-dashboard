import React from 'react';
import './ui.css';

export const Skeleton = ({ className = '', style = {} }) => {
  return (
    <div className={`skeleton ${className}`} style={style}></div>
  );
};
