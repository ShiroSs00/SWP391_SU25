"use client"

import type React from "react"
import { useState } from "react"
import { MessageSquare, Star, Calendar, User, ThumbsUp, MessageCircle, Filter, Search } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import type { FeedbackItem } from "../types/dashboard.type"

interface FeedbackPageProps {
  feedback: FeedbackItem[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

const FeedbackPage: React.FC<FeedbackPageProps> = ({ feedback, loading, error, onRetry }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "rating">("date")

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  // Filter and sort feedback
  const filteredFeedback = feedback
    .filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.relatedRecordId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRating = filterRating === null || item.rating === filterRating

      return matchesSearch && matchesRating
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return b.rating - a.rating
      }
    })

  const averageRating = feedback.length > 0 ? feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: feedback.filter((f) => f.rating === rating).length,
    percentage: feedback.length > 0 ? (feedback.filter((f) => f.rating === rating).length / feedback.length) * 100 : 0,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Phản hồi của tôi</h1>
          <p className="text-gray-600">Xem lại các phản hồi bạn đã gửi về trải nghiệm hiến máu</p>
        </div>
      </div>

      {/* Feedback Stats */}
      {feedback.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Đánh giá trung bình</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-yellow-600">{averageRating.toFixed(1)}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= averageRating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-yellow-600 text-sm mt-1">Từ {feedback.length} phản hồi</p>
              </div>
              <Star className="w-16 h-16 text-yellow-300" />
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân bố đánh giá</h3>
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        count > 0 ? "bg-yellow-400" : "bg-gray-300"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      {feedback.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phản hồi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter by Rating */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterRating || ""}
                onChange={(e) => setFilterRating(e.target.value ? Number.parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tất cả đánh giá</option>
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
                <option value="2">2 sao</option>
                <option value="1">1 sao</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "rating")}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="date">Ngày tạo</option>
                <option value="rating">Đánh giá</option>
              </select>
            </div>
          </div>

          {/* Feedback List */}
          {filteredFeedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {feedback.length === 0 ? "Chưa có phản hồi nào" : "Không tìm thấy phản hồi phù hợp"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {feedback.length === 0
                  ? "Hãy tham gia hiến máu và chia sẻ trải nghiệm của bạn!"
                  : "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Phản hồi cho lần hiến máu #{item.relatedRecordId}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{formatDate(item.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= item.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-600">{item.rating}/5</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 leading-relaxed">{item.message}</p>
                  </div>

                  {item.response && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <MessageCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">Phản hồi từ đội ngũ:</p>
                          <p className="text-blue-700 text-sm">{item.response}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>ID: {item.registrationId}</span>
                      {item.dateUpdated && item.dateUpdated !== item.dateCreated && (
                        <span>Cập nhật: {formatDate(item.dateUpdated)}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.response ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">Đã phản hồi</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Chờ phản hồi</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedback Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Mẹo viết phản hồi hiệu quả
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <Star className="w-4 h-4 text-blue-500 mt-0.5" />
            <span className="text-blue-700">Chia sẻ cảm nhận thật về trải nghiệm</span>
          </div>
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5" />
            <span className="text-blue-700">Đề xuất cải thiện dịch vụ nếu có</span>
          </div>
          <div className="flex items-start space-x-2">
            <Star className="w-4 h-4 text-blue-500 mt-0.5" />
            <span className="text-blue-700">Ghi nhận điểm tích cực của nhân viên</span>
          </div>
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5" />
            <span className="text-blue-700">Phản hồi giúp cải thiện chất lượng dịch vụ</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage
