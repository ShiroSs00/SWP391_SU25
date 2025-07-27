"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bell, Settings, CheckCheck } from "lucide-react"
import { NotificationBadge } from "../components/noti-bage"
import { NotificationItem } from "../components/noti-item"
import { useNotifications } from "../hooks/useNoti"
import LoadingSpinner from "../../member/components/LoadingSpinner"
import type { Notification } from "../type/noti.type"

interface NotificationDropdownProps {
  accountId: string
  onNotificationClick?: (notification: Notification) => void
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ accountId, onNotificationClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { notifications, loading, error, unreadCount, markAsRead, deleteNotification, markAllAsRead, refetch } =
    useNotifications(accountId)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick?.(notification)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <NotificationBadge
        count={unreadCount}
        onClick={() => setIsOpen(!isOpen)}
        className={isOpen ? "bg-gray-100" : ""}
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Thông báo
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
                )}
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Đánh dấu tất cả
                  </button>
                )}
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <Settings className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <button onClick={refetch} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Thử lại
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không có thông báo nào</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.notificationId}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    onClick={handleNotificationClick}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
