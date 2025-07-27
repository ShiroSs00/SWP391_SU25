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

}
