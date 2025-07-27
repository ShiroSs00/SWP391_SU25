"use client"

import type React from "react"
import { SimpleNotificationBell } from "../features/noti/components/SimpleNotificationBell"

interface SimpleHeaderProps {
  userName: string
  userAvatar?: string
  accountId: string
  onLogout?: () => void
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({ userName, userAvatar, accountId, onLogout }) => {
  return (
    <header className="fixed top-0 left-64 right-0 bg-white shadow-sm border-b border-gray-200 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div>
            <h1 className="text-xl font-bold text-red-600"></h1>
          </div>

          {/* Notification Bell & Logout */}
          <SimpleNotificationBell
            accountId={accountId}
            userName={userName}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  )
}
