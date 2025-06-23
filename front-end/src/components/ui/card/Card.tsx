import React from 'react';
import { cn } from '../../../lib/utils';

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "outlined" | "elevated"
    padding?: "none" | "sm" | "md" | "lg"
}
>(({ className, variant = "default", padding = "md", ...props }, ref) => {
    const variants = {
        default: "bg-card text-card-foreground",
        outlined: "border-2 bg-card text-card-foreground",
        elevated: "bg-card text-card-foreground shadow-lg",
        variant: "bg-card text-card-foreground",
    }

    const paddings = {
        none: "",
        sm: "p-3",
        md: "p-6",
        lg: "p-8",
    }

    return (
        <div
            ref={ref}
            className={cn("rounded-lg border shadow-sm", variants[variant], paddings[padding], className)}
            {...props}
        />
    )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
    ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}
>(({ className, as: Component = "h3", ...props }, ref) => (
    <Component ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
    ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
    ),
)
CardFooter.displayName = "CardFooter"

// Stats Card Component
interface StatsCardProps {
    title: string
    value: string | number
    description?: string
    icon?: React.ReactNode
    trend?: {
        value: number
        isPositive: boolean
    }
    className?: string
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
    ({ title, value, description, icon, trend, className }, ref) => (
        <Card ref={ref} className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {trend && (
                            <span className={cn("flex items-center", trend.isPositive ? "text-green-600" : "text-red-600")}>
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
                        )}
                        {description && <span>{description}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    ),
)
StatsCard.displayName = "StatsCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, StatsCard }
