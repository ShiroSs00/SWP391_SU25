import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { Button } from '../Button';
import { Badge } from '../badge';
import { ScrollArea } from '../scroll-area.tsx';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../collapsible';
import { ChevronDown, ChevronRight } from "lucide-react";


export interface SidebarItem {
    id: string
    label: string
    icon?: React.ReactNode
    href?: string
    badge?: string | number
    children?: SidebarItem[]
    onClick?: () => void
    disabled?: boolean
}

export interface SidebarProps {
    items: SidebarItem[]
    className?: string
    collapsed?: boolean
    onItemClick?: (item: SidebarItem) => void
}

const Sidebar: React.FC<SidebarProps> = ({ items, className, collapsed = false, onItemClick }) => {
    const location = useLocation()
    const [openGroups, setOpenGroups] = React.useState<Set<string>>(new Set())

    const toggleGroup = (groupId: string) => {
        setOpenGroups((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(groupId)) {
                newSet.delete(groupId)
            } else {
                newSet.add(groupId)
            }
            return newSet
        })
    }

    const isActive = (href?: string) => {
        if (!href) return false
        return location.pathname === href || location.pathname.startsWith(href + "/")
    }

    const hasActiveChild = (children?: SidebarItem[]): boolean => {
        if (!children) return false
        return children.some((child) => isActive(child.href) || hasActiveChild(child.children))
    }


    const renderSidebarItem = (item: SidebarItem, level = 0) => {
        const hasChildren = item.children && item.children.length > 0
        const isGroupOpen = openGroups.has(item.id)
        const itemIsActive = isActive(item.href)
        const hasActiveChildItem = hasActiveChild(item.children)

        if (hasChildren) {
            return (
                <Collapsible key={item.id} open={isGroupOpen} onOpenChange={() => toggleGroup(item.id)}>
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start h-10",
                                level > 0 && "ml-4",
                                (itemIsActive || hasActiveChildItem) && "bg-accent text-accent-foreground",
                                collapsed && "justify-center px-2",
                            )}
                            disabled={item.disabled}
                        >
                            {item.icon && <span className={cn("flex-shrink-0", !collapsed && "mr-2")}>{item.icon}</span>}
                            {!collapsed && (
                                <>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge && (
                                        <Badge variant="secondary" size="sm" className="ml-auto mr-2">
                                            {item.badge}
                                        </Badge>
                                    )}
                                    {isGroupOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </>
                            )}
                        </Button>
                    </CollapsibleTrigger>
                    {!collapsed && (
                        <CollapsibleContent className="space-y-1">
                            {item.children?.map((child) => renderSidebarItem(child, level + 1))}
                        </CollapsibleContent>
                    )}
                </Collapsible>
            )
        }

        if (item.href) {
            // Render as Link
            return (
                <Link
                    key={item.id}
                    to={item.href}
                    className={cn("w-full block")}
                >
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start h-10",
                            level > 0 && "ml-4",
                            itemIsActive && "bg-accent text-accent-foreground",
                            collapsed && "justify-center px-2",
                        )}
                        disabled={item.disabled}
                        onClick={() => onItemClick?.(item)}
                    >
                        {item.icon && <span className={cn("flex-shrink-0", !collapsed && "mr-2")}>{item.icon}</span>}
                        {!collapsed && (
                            <>
                                <span className="flex-1 text-left">{item.label}</span>
                                {item.badge && (
                                    <Badge variant="secondary" size="sm" className="ml-auto">
                                        {item.badge}
                                    </Badge>
                                )}
                            </>
                        )}
                    </Button>
                </Link>
            );
        } else {
            // Render as button
            return (
                <button
                    key={item.id}
                    type="button"
                    className="w-full"
                    onClick={item.onClick}
                    disabled={item.disabled}
                >
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start h-10",
                            level > 0 && "ml-4",
                            itemIsActive && "bg-accent text-accent-foreground",
                            collapsed && "justify-center px-2",
                        )}
                        disabled={item.disabled}
                        onClick={() => onItemClick?.(item)}
                    >
                        {item.icon && <span className={cn("flex-shrink-0", !collapsed && "mr-2")}>{item.icon}</span>}
                        {!collapsed && (
                            <>
                                <span className="flex-1 text-left">{item.label}</span>
                                {item.badge && (
                                    <Badge variant="secondary" size="sm" className="ml-auto">
                                        {item.badge}
                                    </Badge>
                                )}
                            </>
                        )}
                    </Button>
                </button>
            );
        }
    }


    return (
        <div className={cn("flex flex-col h-full border-r bg-background", collapsed ? "w-16" : "w-64", className)}>
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-1">{items.map((item) => renderSidebarItem(item))}</nav>
            </ScrollArea>
        </div>
    )
}

export { Sidebar }
