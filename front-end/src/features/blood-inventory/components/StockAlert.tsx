import React from 'react';
import { AlertTriangle, Clock, Thermometer, TrendingDown, Bell, X, CheckCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { InventoryAlert, AlertType, AlertSeverity } from '../types/inventory.types';

export interface StockAlertProps {
  alert: InventoryAlert;
  onAcknowledge?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  showActions?: boolean;
  className?: string;
}

const StockAlert: React.FC<StockAlertProps> = ({
  alert,
  onAcknowledge,
  onResolve,
  onDismiss,
  showActions = true,
  className = ''
}) => {
  const getAlertIcon = (type: AlertType) => {
    const icons = {
      'low-stock': TrendingDown,
      'critical-stock': AlertTriangle,
      'expiration': Clock,
      'temperature': Thermometer,
      'contamination': AlertTriangle,
      'equipment-failure': AlertTriangle,
      'quality-issue': AlertTriangle,
      'recall': Bell
    };
    return icons[type] || AlertTriangle;
  };

  const getSeverityConfig = (severity: AlertSeverity) => {
    const configs = {
      'low': {
        variant: 'info' as const,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-900',
        iconColor: 'text-blue-600'
      },
      'medium': {
        variant: 'warning' as const,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-900',
        iconColor: 'text-yellow-600'
      },
      'high': {
        variant: 'danger' as const,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-900',
        iconColor: 'text-orange-600'
      },
      'critical': {
        variant: 'danger' as const,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-900',
        iconColor: 'text-red-600'
      }
    };
    return configs[severity];
  };

  const getTypeLabel = (type: AlertType) => {
    const labels = {
      'low-stock': 'Low Stock',
      'critical-stock': 'Critical Stock',
      'expiration': 'Expiration Alert',
      'temperature': 'Temperature Alert',
      'contamination': 'Contamination',
      'equipment-failure': 'Equipment Failure',
      'quality-issue': 'Quality Issue',
      'recall': 'Product Recall'
    };
    return labels[type] || type;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const AlertIcon = getAlertIcon(alert.type);
  const severityConfig = getSeverityConfig(alert.severity);
  const isAcknowledged = !!alert.acknowledgedAt;
  const isResolved = !!alert.resolvedAt;

  return (
    <Card 
      className={`${severityConfig.bgColor} ${severityConfig.borderColor} border-l-4 ${className}`}
      padding="md"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-white ${severityConfig.iconColor}`}>
              <AlertIcon className="w-5 h-5" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold ${severityConfig.textColor}`}>
                  {getTypeLabel(alert.type)}
                </h3>
                <Badge variant={severityConfig.variant} size="sm">
                  {alert.severity.toUpperCase()}
                </Badge>
                {isResolved && (
                  <Badge variant="success" size="sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Resolved
                  </Badge>
                )}
                {isAcknowledged && !isResolved && (
                  <Badge variant="info" size="sm">
                    Acknowledged
                  </Badge>
                )}
              </div>
              
              <p className={`text-sm ${severityConfig.textColor} mb-2`}>
                {alert.message}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>Alert ID: {alert.id}</span>
                <span>{formatTimeAgo(alert.createdAt)}</span>
                {alert.unitsAffected && (
                  <span>{alert.unitsAffected.length} units affected</span>
                )}
              </div>
            </div>
          </div>
          
          {showActions && onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDismiss(alert.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Alert Details */}
        {(alert.bloodType || alert.component || alert.threshold !== undefined) && (
          <div className="bg-white bg-opacity-50 rounded-lg p-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {alert.bloodType && (
                <div>
                  <span className="text-gray-600">Blood Type:</span>
                  <div className="font-medium">{alert.bloodType}</div>
                </div>
              )}
              
              {alert.component && (
                <div>
                  <span className="text-gray-600">Component:</span>
                  <div className="font-medium">{alert.component}</div>
                </div>
              )}
              
              {alert.threshold !== undefined && (
                <div>
                  <span className="text-gray-600">Threshold:</span>
                  <div className="font-medium">{alert.threshold} units</div>
                </div>
              )}
              
              {alert.currentLevel !== undefined && (
                <div>
                  <span className="text-gray-600">Current Level:</span>
                  <div className="font-medium">{alert.currentLevel} units</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {alert.actions.length > 0 && (
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${severityConfig.textColor}`}>
              Recommended Actions:
            </h4>
            <div className="space-y-1">
              {alert.actions.map((action, index) => (
                <div key={action.id} className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    action.completedAt ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <span className={action.completedAt ? 'line-through text-gray-500' : ''}>
                    {action.description}
                  </span>
                  {action.assignedTo && (
                    <span className="text-xs text-gray-500">
                      (Assigned to: {action.assignedTo})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && !isResolved && (
          <div className="flex items-center gap-2 pt-2 border-t border-white border-opacity-50">
            {!isAcknowledged && onAcknowledge && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAcknowledge(alert.id)}
              >
                Acknowledge
              </Button>
            )}
            
            {isAcknowledged && onResolve && (
              <Button
                size="sm"
                variant="success"
                onClick={() => onResolve(alert.id)}
              >
                Mark Resolved
              </Button>
            )}
          </div>
        )}

        {/* Acknowledgment Info */}
        {isAcknowledged && (
          <div className="text-xs text-gray-600 pt-2 border-t border-white border-opacity-50">
            Acknowledged by {alert.acknowledgedBy} on {alert.acknowledgedAt?.toLocaleDateString()}
            {isResolved && alert.resolvedAt && (
              <span> • Resolved on {alert.resolvedAt.toLocaleDateString()}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StockAlert;