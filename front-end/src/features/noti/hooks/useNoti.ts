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
  }
}
