"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Bell, LogOut } from "lucide-react"
import { useNotifications } from "../hooks/useNoti"
import { NotificationItem } from "../components/noti-item"
import LoadingSpinner from "../../member/components/LoadingSpinner"

interface SimpleNotificationBellProps {
  accountId: string
  userName: string
  userAvatar?: string
  onLogout?: () => void
}

export const SimpleNotificationBell: React.FC<SimpleNotificationBellProps> = ({
  accountId,
  userName,
  userAvatar,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { notifications, loading, unreadCount, markAsRead, deleteNotification } = useNotifications(accountId)

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

  const recentNotifications = notifications.slice(0, 5) // Show only 5 recent notifications

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      // Default logout behavior
      localStorage.removeItem("authToken")
      window.location.href = "/login"
    }
  }

  return (
    <div className="flex items-center space-x-4">
      {/* User Info */}
      <div className="flex items-center space-x-3">
        <img
          src={userAvatar || "/placeholder.svg?height=32&width=32"}
          alt={userName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-700">{userName}</span>
      </div>

      {/* Notification Bell */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : recentNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Không có thông báo nào</p>
                </div>
              ) : (
                <div>
                  {recentNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.notificationId}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Xem tất cả thông báo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Đăng xuất"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Đăng xuất</span>
      </button>
    </div>
  )
}
