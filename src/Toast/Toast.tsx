import React, { useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { IoMdCloseCircle } from 'react-icons/io';
import { IoCheckmarkCircleSharp } from 'react-icons/io5';

export type ToastType = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          border: 'border-emerald-200',
          icon: (
            <IoCheckmarkCircleSharp className="text-emerald-600" size={20} />
          ),
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          text: 'text-red-800',
          border: 'border-red-200',
          icon: <IoMdCloseCircle className="text-red-600" size={20} />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-200',
          icon: <AlertTriangle className="text-amber-600" size={20} />,
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-800',
          border: 'border-blue-200',
          icon: <Info className="text-blue-600" size={20} />,
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: <Info className="text-gray-600" size={20} />,
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      style={{ background: 'linear-gradient(to right, #1a202c, #441c31' }}
      className={`${styles.bg}  ${styles.border} border px-4 text-white py-3 rounded-lg shadow-sm flex items-start gap-3 w-full max-w-md transition-all duration-300 ease-in-out`}
    >
      <div className="mt-0.5">{styles.icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-white hover:text-gray-500 transition-colors"
        aria-label="Close toast"
      >
        <X size={16} />
      </button>
    </div>
  );
};
