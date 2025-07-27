"use client"

import type React from "react"

import { Bell } from "lucide-react"
import { cn } from "../../../lib/utils"

interface NotificationBadgeProps {
  count: number
  onClick?: () => void
  className?: string
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, onClick, className }) => {
  return (
    <button onClick={onClick} className={cn("relative p-2 rounded-lg hover:bg-gray-100 transition-colors", className)}>
      <Bell className="w-6 h-6 text-gray-600" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  )
}
