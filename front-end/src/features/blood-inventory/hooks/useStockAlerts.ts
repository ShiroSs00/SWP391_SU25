import React from 'react';
import { InventoryAlert, AlertType, AlertSeverity } from '../types/inventory.types';

export interface UseStockAlertsReturn {
  alerts: InventoryAlert[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  dismissAlert: (alertId: string) => Promise<void>;
  refreshAlerts: () => Promise<void>;
}

export const useStockAlerts = (): UseStockAlertsReturn => {
  const [alerts, setAlerts] = React.useState<InventoryAlert[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const generateMockAlerts = (): InventoryAlert[] => {
    const alertTypes: AlertType[] = ['low-stock', 'critical-stock', 'expiration', 'temperature'];
    const severities: AlertSeverity[] = ['low', 'medium', 'high', 'critical'];
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    
    return Array.from({ length: 8 }, (_, i) => {
      const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const bloodType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
      const createdAt = new Date();
      createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 24));
      
      const isAcknowledged = Math.random() > 0.6;
      const isResolved = isAcknowledged && Math.random() > 0.7;
      
      const messages = {
        'low-stock': `Low stock alert for ${bloodType} blood type. Current level: ${Math.floor(Math.random() * 10) + 1} units`,
        'critical-stock': `Critical stock shortage for ${bloodType}. Immediate action required.`,
        'expiration': `${Math.floor(Math.random() * 5) + 1} units of ${bloodType} expiring within 24 hours`,
        'temperature': `Temperature deviation detected in storage unit. Current: ${(Math.random() * 2 + 8).toFixed(1)}°C`
      };

      return {
        id: `ALERT-${String(i + 1).padStart(6, '0')}`,
        type,
        severity,
        bloodType: type !== 'temperature' ? bloodType as any : undefined,
        message: messages[type],
        threshold: type.includes('stock') ? Math.floor(Math.random() * 20) + 5 : undefined,
        currentLevel: type.includes('stock') ? Math.floor(Math.random() * 10) + 1 : undefined,
        unitsAffected: [`BU${String(Math.floor(Math.random() * 1000)).padStart(6, '0')}`],
        createdAt,
        acknowledgedBy: isAcknowledged ? `Staff-${Math.floor(Math.random() * 10) + 1}` : undefined,
        acknowledgedAt: isAcknowledged ? new Date(createdAt.getTime() + Math.random() * 3600000) : undefined,
        resolvedAt: isResolved ? new Date() : undefined,
        actions: [
          {
            id: `ACTION-${i + 1}-1`,
            type: 'notify',
            description: 'Notify blood bank supervisor',
            assignedTo: `Supervisor-${Math.floor(Math.random() * 3) + 1}`,
            completedAt: isAcknowledged ? new Date() : undefined
          },
          {
            id: `ACTION-${i + 1}-2`,
            type: type.includes('stock') ? 'order' : 'test',
            description: type.includes('stock') ? 'Order emergency blood supply' : 'Verify temperature readings',
            assignedTo: `Staff-${Math.floor(Math.random() * 5) + 1}`,
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            completedAt: isResolved ? new Date() : undefined
          }
        ]
      };
    });
  };

  const refreshAlerts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockAlerts = generateMockAlerts();
      setAlerts(mockAlerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              acknowledgedBy: 'Current User',
              acknowledgedAt: new Date()
            }
          : alert
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to acknowledge alert');
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              resolvedAt: new Date(),
              actions: alert.actions.map(action => ({
                ...action,
                completedAt: action.completedAt || new Date()
              }))
            }
          : alert
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve alert');
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dismiss alert');
    }
  };

  const unreadCount = alerts.filter(alert => !alert.acknowledgedAt && !alert.resolvedAt).length;

  React.useEffect(() => {
    refreshAlerts();
  }, []);

  return {
    alerts,
    unreadCount,
    loading,
    error,
    acknowledgeAlert,
    resolveAlert,
    dismissAlert,
    refreshAlerts
  };
};

export default useStockAlerts;