"use client"

import { useState, useEffect, useCallback } from "react"
import { NotificationService } from "../service/noti.service"
import type { Notification } from "../type/noti.type"

export const useNotifications = (accountId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async () => {
    if (!accountId) return

    try {
      setLoading(true)
      setError(null)
      const data = await NotificationService.getNotifications(accountId)
      setNotifications(data)

      // Calculate unread count
      const unread = data.filter((n) => !n.isRead).length
      setUnreadCount(unread)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch notifications")
    } finally {
      setLoading(false)
    }
  }, [accountId])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const success = await NotificationService.markAsRead(notificationId)
      if (success) {
        setNotifications((prev) => prev.map((n) => (n.notificationId === notificationId ? { ...n, isRead: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }, [])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const success = await NotificationService.deleteNotification(notificationId)
      if (success) {
        setNotifications((prev) => {
          const filtered = prev.filter((n) => n.notificationId !== notificationId)
          const unread = filtered.filter((n) => !n.isRead).length
          setUnreadCount(unread)
          return filtered
        })
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead)

    try {
      await Promise.all(unreadNotifications.map((n) => NotificationService.markAsRead(n.notificationId)))

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }, [notifications])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  return {
    notifications,
    loading,
    error,
    unreadCount,
    refetch: fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  }
}
