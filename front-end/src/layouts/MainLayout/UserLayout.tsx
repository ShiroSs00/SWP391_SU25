"use client"

import type React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../../features/accounts/components/Sidebar"
import { SimpleHeader } from "../SimpleHeader"
import LoadingSpinner from "../../features/accounts/components/LoadingSpinner"
import ErrorMessage from "../../features/accounts/components/ErrorMessage"
import { useDashboard } from "../../features/accounts/hooks/useDashboard"

export const SimpleUserLayout: React.FC = () => {
  const { profile, loading, error, loadInitialData } = useDashboard()

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem("authToken")

    // Redirect to login page
    window.location.href = "/login"

    // Or if using React Router:
    // navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={loadInitialData} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab="dashboard" onTabChange={() => {}} />

      {/* Simple Header with Notification Bell */}
      <SimpleHeader
        userName={profile?.name || "Người dùng"}
        accountId={profile?.id || profile?.accountId || ""}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
