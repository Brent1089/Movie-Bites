import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext();

/**
 * Provides toast notification helpers and renders the active toast stack.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * Removes a toast from the stack by ID.
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Shows a temporary notification message.
   */
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();

    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map(toast => (
          <div key={toast.id} className={`app-toast app-toast-${toast.type}`}>
            <span>{toast.message}</span>
            <button
              type="button"
              className="toast-close"
              aria-label="Dismiss notification"
              onClick={() => removeToast(toast.id)}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Reads toast actions from ToastContext.
 */
export function useToast() {
  return useContext(ToastContext);
}
