import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClass = `spinner-${size}`;
  
  return (
    <div className="loading-container">
      <div className={`spinner ${sizeClass}`}></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner; 