import React from 'react';
import { AlertTriangle, Home, ArrowLeft, Mail, Shield } from 'lucide-react';
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { useNavigate } from "react-router-dom"

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
          <CardDescription className="text-[#222222]">You don't have permission to access this resource</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Error 403 - Forbidden</h3>
                <p className="text-sm text-red-700 mt-1">
                  Your current role doesn't have the required permissions to view this page.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-[#222222]">What you can do:</h4>
            <ul className="space-y-2 text-sm text-[#222222]">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[#222222] rounded-full"></div>
                <span>Contact your administrator for access</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[#222222] rounded-full"></div>
                <span>Check if you're logged in with the correct account</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[#222222] rounded-full"></div>
                <span>Return to a page you have access to</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <Button onClick={handleGoBack} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={handleGoHome} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500 mb-2">Need help?</p>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UnauthorizedPage
