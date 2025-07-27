export interface Notification {
  notificationId: string
  accountId: string
  title: string
  content: string
  img?: string
  createDate: string
  isRead?: boolean
  type?: "info" | "warning" | "success" | "error" | "urgent"
}

export interface NotificationResponse {
  success: boolean
  message: string
  data: Notification[]
  errors?: {
    additionalProp1?: string
    additionalProp2?: string
    additionalProp3?: string
  }
}

export interface SendNotificationRequest {
  notificationId: string
  accountId: string
  title: string
  content: string
  img?: string
  createDate: string
}

export interface SendMultipleNotificationRequest {
  notificationId: string
  accountId: string
  title: string
  content: string
  img?: string
  createDate: string
}
;[]
