"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Wrench, Clock, RefreshCw, AlertCircle, Twitter, Facebook, Mail } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const MaintenancePage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <Wrench className="w-10 h-10 text-blue-600 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold text-blue-600">System Maintenance</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            We're currently performing scheduled maintenance to improve your experience
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Countdown Timer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Estimated Time Remaining</h3>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{timeLeft.hours.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{timeLeft.minutes.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-gray-500">Minutes</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{timeLeft.seconds.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-gray-500">Seconds</div>
                </div>
              </div>
            </div>
          </div>

          {/* What we're working on */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 text-center">What we're improving:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h5 className="font-medium text-gray-800 mb-2">🚀 Performance Upgrades</h5>
                <p className="text-sm text-gray-600">Optimizing server response times and database queries</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h5 className="font-medium text-gray-800 mb-2">🔒 Security Enhancements</h5>
                <p className="text-sm text-gray-600">Implementing latest security patches and protocols</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h5 className="font-medium text-gray-800 mb-2">✨ New Features</h5>
                <p className="text-sm text-gray-600">Adding exciting new functionality for better user experience</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h5 className="font-medium text-gray-800 mb-2">🐛 Bug Fixes</h5>
                <p className="text-sm text-gray-600">Resolving reported issues and improving stability</p>
              </div>
            </div>
          </div>

          {/* Emergency Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800">Emergency Access</h3>
                <p className="text-sm text-orange-700 mt-1">
                  If you need immediate assistance with blood donation emergencies, please contact your local emergency
                  services or hospital directly.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <Button onClick={handleRefresh} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Check if We're Back Online
            </Button>
          </div>

          {/* Social Links */}
          <div className="text-center pt-4 border-t border-[#e5e5e5]">
            <p className="text-sm text-[#222222] mb-4">Stay updated on our progress:</p>
            <div className="flex justify-center space-x-4">
              <Button variant="ghost" size="sm" className="text-[#222222] hover:text-blue-600">
                <Twitter className="w-4 h-4 mr-2 text-[#222222] group-hover:text-blue-600" />
                Twitter
              </Button>
              <Button variant="ghost" size="sm" className="text-[#222222] hover:text-blue-700">
                <Facebook className="w-4 h-4 mr-2 text-[#222222] group-hover:text-blue-700" />
                Facebook
              </Button>
              <Button variant="ghost" size="sm" className="text-[#222222] hover:text-[#555]">
                <Mail className="w-4 h-4 mr-2 text-[#222222] group-hover:text-[#555]" />
                Email Updates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MaintenancePage
