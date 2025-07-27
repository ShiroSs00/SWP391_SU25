import api from "../../../services/axios/api"
import type {
  Notification,
  NotificationResponse,
  SendNotificationRequest,
  SendMultipleNotificationRequest,
} from "../type/noti.type"

export class NotificationService {
  // Get notifications for a specific account
  static async getNotifications(accountId: string): Promise<Notification[]> {
    try {
      const response = await api.get<NotificationResponse>(`/notifications/account/${accountId}`)

      if (response.data.success) {
        return response.data.data || []
      } else {
        throw new Error(response.data.message || "Failed to fetch notifications")
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      throw error
    }
  }

  // Send a single notification
  static async sendNotification(notification: SendNotificationRequest): Promise<boolean> {
    try {
      const response = await api.post<NotificationResponse>("/notifications/send", notification)
      return response.data.success
    } catch (error) {
      console.error("Error sending notification:", error)
      throw error
    }
  }

  // Send multiple notifications
  static async sendMultipleNotifications(notifications: SendMultipleNotificationRequest): Promise<boolean> {
    try {
      const response = await api.post<NotificationResponse>("/notifications/send-multiple", notifications)
      return response.data.success
    } catch (error) {
      console.error("Error sending multiple notifications:", error)
      throw error
    }
  }

  // Mark notification as read (assuming this endpoint exists)
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`)
      return response.status === 200
    } catch (error) {
      console.error("Error marking notification as read:", error)
      return false
    }
  }

  // Delete notification (assuming this endpoint exists)
  static async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await api.delete(`/notifications/${notificationId}`)
      return response.status === 200
    } catch (error) {
      console.error("Error deleting notification:", error)
      return false
    }
  }
}
