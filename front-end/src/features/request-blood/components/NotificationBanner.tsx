import React from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface NotificationBannerProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose?: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  title,
  message,
  onClose,
}) => {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
        };
      case 'warning':
        return {
          container: 'bg-orange-50 border-orange-200 text-orange-800',
          icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <Info className="w-5 h-5 text-blue-500" />,
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: <Info className="w-5 h-5 text-gray-500" />,
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`border rounded-lg p-4 ${styles.container}`}>
      <div className="flex items-start gap-3">
        {styles.icon}
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};