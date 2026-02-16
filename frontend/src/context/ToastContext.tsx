import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertCircle, CheckCircle } from 'lucide-react';

type ToastType = 'info' | 'success' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-300 flex flex-col gap-3 pointer-events-none items-end">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: (Math.random() - 0.5) * 4 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div 
                className={`
                  sketch-border p-4 bg-white min-w-[300px] max-w-md shadow-2xl relative flex items-center gap-3
                  ${toast.type === 'error' ? 'border-highlighter-pink' : toast.type === 'success' ? 'border-green-500' : 'border-ink'}
                `}
              >
                {/* Tape effect top center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-tape/30 -rotate-1 skew-x-12" />
                
                <div className={`shrink-0 ${toast.type === 'error' ? 'text-highlighter-pink' : toast.type === 'success' ? 'text-green-600' : 'text-ink'}`}>
                  {toast.type === 'error' && <AlertCircle size={24} />}
                  {toast.type === 'success' && <CheckCircle size={24} />}
                  {toast.type === 'info' && <Info size={24} />}
                </div>

                <p className="font-hand text-xl flex-1 leading-tight">{toast.message}</p>
                
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="opacity-40 hover:opacity-100 transition-opacity p-1"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
