"use client"

import type React from "react"

import { useState } from "react"
import { X, Clock, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "../../../lib/utils"
import type { Notification } from "../type/noti.type"

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
  onClick?: (notification: Notification) => void
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "urgent":
        return <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getNotificationBg = (type?: string, isRead?: boolean) => {
    const baseClasses = isRead ? "bg-gray-50" : "bg-white border-l-4"

    if (isRead) return baseClasses

    switch (type) {
      case "success":
        return `${baseClasses} border-l-green-500`
      case "warning":
        return `${baseClasses} border-l-yellow-500`
      case "error":
        return `${baseClasses} border-l-red-500`
      case "urgent":
        return `${baseClasses} border-l-red-600 bg-red-50`
      default:
        return `${baseClasses} border-l-blue-500`
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

      if (diffInMinutes < 1) return "Vừa xong"
      if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
      return date.toLocaleDateString("vi-VN")
    } catch {
      return dateString
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDeleting) return

    setIsDeleting(true)
    try {
      await onDelete?.(notification.notificationId)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead?.(notification.notificationId)
    }
    onClick?.(notification)
  }

  return (
    <div
      className={cn(
        "p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group",
        getNotificationBg(notification.type, notification.isRead),
      )}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={cn("text-sm font-medium text-gray-900 mb-1", !notification.isRead && "font-semibold")}>
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notification.content}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatDate(notification.createDate)}</span>
                {!notification.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
              </div>
            </div>

            {/* Image if available */}
            {notification.img && (
              <img
                src={notification.img || "/placeholder.svg"}
                alt=""
                className="w-12 h-12 rounded-lg object-cover ml-3 flex-shrink-0"
              />
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 transition-all"
        >
          <X className={cn("w-4 h-4 text-gray-400 hover:text-gray-600", isDeleting && "animate-spin")} />
        </button>
      </div>
    </div>
  )
}
