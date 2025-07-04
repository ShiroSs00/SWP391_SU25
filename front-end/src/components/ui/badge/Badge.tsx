import React from 'react';
import { cva, type VariantProps} from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
                success: "border-transparent bg-green-500 text-white hover:bg-green-600",
                warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
                info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
                // Blood type specific variants
                blood: "border-transparent bg-red-500 text-white hover:bg-red-600",
                urgent: "border-transparent bg-red-600 text-white animate-pulse",
                available: "border-transparent bg-green-500 text-white",
                expired: "border-transparent bg-gray-500 text-white",
                reserved: "border-transparent bg-yellow-500 text-white",
            },
            size: {
                default: "px-2.5 py-0.5 text-xs",
                sm: "px-2 py-0.5 text-xs",
                lg: "px-3 py-1 text-sm",
                md: "px-2.5 py-0.5 text-xs",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
    icon?: React.ReactNode
    removable?: boolean
    onRemove?: () => void
}

function Badge({ className, variant, size, icon, removable, onRemove, children, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
            {icon && <span className="mr-1">{icon}</span>}
            {children}
            {removable && (
                <button type="button" className="ml-1 hover:bg-black/20 rounded-full p-0.5" onClick={onRemove}>
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            )}
        </div>
    )
}

// Blood Type Badge Component
interface BloodTypeBadgeProps {
    bloodType: string
    className?: string
}

function BloodTypeBadge({ bloodType, className }: BloodTypeBadgeProps) {
    return (
        <Badge variant="blood" className={cn("font-bold", className)}>
            {bloodType}
        </Badge>
    )
}

// Status Badge Component
interface StatusBadgeProps {
    status: string
    className?: string
}

function StatusBadge({ status, className }: StatusBadgeProps) {
    const getVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case "available":
            case "active":
            case "completed":
            case "approved":
                return "success"
            case "pending":
            case "scheduled":
                return "warning"
            case "expired":
            case "cancelled":
            case "rejected":
                return "destructive"
            case "urgent":
            case "critical":
                return "urgent"
            case "reserved":
                return "reserved"
            default:
                return "secondary"
        }
    }

    return (
        <Badge variant={getVariant(status)} className={className}>
            {status}
        </Badge>
    )
}

export { Badge as default, badgeVariants, BloodTypeBadge, StatusBadge }