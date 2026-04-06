import { useState } from 'react';
import ToastContainer from './ToastNotification';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message = '', type = 'info', icon = '📌') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type, icon }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
    ToastContainer: (props) => <ToastContainer {...props} toasts={toasts} onRemove={removeToast} />
  };
};
