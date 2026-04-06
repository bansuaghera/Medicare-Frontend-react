import React, { useEffect } from 'react';
import './activityStyles.css';

// Toast container component
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px'
    }}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

// Individual toast component
const Toast = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 5000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const typeToColor = {
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  };

  return (
    <div style={{
      background: '#ffffff',
      border: `3px solid ${typeToColor[toast.type] || '#007bff'}`,
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'slideIn 0.3s ease'
    }}>
      <span style={{ fontSize: '24px' }}>{toast.icon}</span>
      <div>
        <div style={{
          fontWeight: '600',
          color: '#333',
          fontSize: '14px',
          marginBottom: '4px'
        }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{
            color: '#666',
            fontSize: '12px'
          }}>
            {toast.message}
          </div>
        )}
      </div>
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          marginLeft: 'auto',
          padding: '0'
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default ToastContainer;
