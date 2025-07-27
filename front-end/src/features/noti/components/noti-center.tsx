"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Filter, Search, Trash2, CheckCheck } from "lucide-react"
import { NotificationItem } from "../components/noti-item"
import { useNotifications } from "../hooks/useNoti"
import LoadingSpinner from "../../member/components/LoadingSpinner"
import { Input } from "../../../components/ui/input/Input"
import { Button } from "../../../components/ui/Button/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select/Select"
import type { Notification } from "../type/noti.type"

interface NotificationCenterProps {
  accountId: string
  onNotificationClick?: (notification: Notification) => void
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ accountId, onNotificationClick }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const { notifications, loading, error, unreadCount, markAsRead, deleteNotification, markAllAsRead, refetch } =
    useNotifications(accountId)

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || notification.type === filterType

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "unread" && !notification.isRead) ||
      (filterStatus === "read" && notification.isRead)

    return matchesSearch && matchesType && matchesStatus
  })

  const handleBulkDelete = async () => {
    const readNotifications = notifications.filter((n) => n.isRead)
    await Promise.all(readNotifications.map((n) => deleteNotification(n.notificationId)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">
          Thử lại
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="w-6 h-6 mr-3 text-blue-500" />
            Trung tâm thông báo
            {unreadCount > 0 && (
              <span className="ml-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full">{unreadCount} mới</span>
            )}
          </h2>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <CheckCheck className="w-4 h-4 mr-2" />
                Đánh dấu tất cả
              </Button>
            )}
            <Button onClick={handleBulkDelete} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa đã đọc
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm thông báo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="info">Thông tin</SelectItem>
              <SelectItem value="success">Thành công</SelectItem>
              <SelectItem value="warning">Cảnh báo</SelectItem>
              <SelectItem value="error">Lỗi</SelectItem>
              <SelectItem value="urgent">Khẩn cấp</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="unread">Chưa đọc</SelectItem>
              <SelectItem value="read">Đã đọc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? "Không tìm thấy thông báo phù hợp"
                : "Không có thông báo nào"}
            </p>
          </div>
        ) : (
          <div>
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.notificationId}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                onClick={onNotificationClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
