import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { CalendarIcon, ClockIcon, ArrowRightIcon, NewspaperIcon } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { blogService } from "../../features/blog/services/blog.service";
import type { BlogPost } from "../../features/blog/types/blog.types";

export function NewsSection() {
  const navigate = useNavigate()
  const [latestNews, setLatestNews] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const blogs = await blogService.getLatestBlogs()
        
        // Ensure blogs is always an array
        const blogsArray = Array.isArray(blogs) ? blogs : [blogs];
        setLatestNews(blogsArray)
      } catch (err) {
        console.error('Error fetching latest news:', err)
        setError('Không thể tải tin tức mới nhất')
        setLatestNews([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestNews()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const handleReadMore = (blogId: string) => {
    navigate(`/blogs/${blogId}`)
  }

  const handleViewAllNews = () => {
    navigate("/blogs")
  }

  // Function to calculate read time based on content
  const calculateReadTime = (content: string) => {
    if (!content) return "3 phút"
    
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    const readTimeMinutes = Math.ceil(words / wordsPerMinute)
    const finalReadTime = Math.max(1, Math.min(15, readTimeMinutes))
    
    return `${finalReadTime} phút`
  }

  // Function to create excerpt from content
  const createExcerpt = (content: string) => {
    if (!content) return 'Không có nội dung'
    return content.length > 150 ? content.substring(0, 150) + '...' : content
  }

  // Function to create title from content
  const createTitle = (content: string) => {
    if (!content) return "Tin tức mới"
    
    const sentences = content.split(/[.!?]+/)
    const firstSentence = sentences[0]?.trim()
    
    if (firstSentence && firstSentence.length > 10 && firstSentence.length < 100) {
      return firstSentence
    }
    
    return content.substring(0, 80).trim() + (content.length > 80 ? '...' : '')
  }

  const getCategoryColor = (tagName: string) => {
    const tag = tagName?.toLowerCase() || ''
    
    if (tag.includes('sự kiện')) return "bg-red-100 text-red-800 border-red-200"
    if (tag.includes('công nghệ')) return "bg-blue-100 text-blue-800 border-blue-200"
    if (tag.includes('sức khỏe')) return "bg-green-100 text-green-800 border-green-200"
    if (tag.includes('giáo dục')) return "bg-purple-100 text-purple-800 border-purple-200"
    if (tag.includes('nghiên cứu')) return "bg-indigo-100 text-indigo-800 border-indigo-200"
    if (tag.includes('hướng dẫn')) return "bg-teal-100 text-teal-800 border-teal-200"
    if (tag.includes('câu chuyện')) return "bg-pink-100 text-pink-800 border-pink-200"
    
    return "bg-orange-100 text-orange-800 border-orange-200"
  }

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-rose-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-rose-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-6">
              <NewspaperIcon className="w-4 h-4 mr-2" />
              Tin tức
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Tin tức mới nhất
            </h2>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-rose-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-6">
            <NewspaperIcon className="w-4 h-4 mr-2" />
            Tin tức nổi bật
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Cập nhật
            <span className="block bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              tin tức mới nhất
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Theo dõi những tin tức, sự kiện và kiến thức mới nhất về hiến máu và chăm sóc sức khỏe cộng đồng.
          </p>
        </div>

        {/* Featured News */}
        {latestNews.length > 0 && (
          <div className="mb-12">
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={latestNews[0].img || latestNews[0].thumbnail || `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                    alt={createTitle(latestNews[0].content)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={`border ${getCategoryColor(latestNews[0].tagName)}`}>
                      {latestNews[0].tagName || 'Tin tức'}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {formatDate(latestNews[0].postDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {calculateReadTime(latestNews[0].content)}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-red-600 transition-colors cursor-pointer">
                    {createTitle(latestNews[0].content)}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {createExcerpt(latestNews[0].content)}
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleReadMore(latestNews[0].blogId)}
                      className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors"
                    >
                      Đọc thêm
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {latestNews.slice(1, 4).map((blog) => (
            <Card
              key={blog.blogId}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={blog.img || blog.thumbnail || `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                  alt={createTitle(blog.content)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                {/* Meta info */}
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={`border ${getCategoryColor(blog.tagName)}`}>
                    {blog.tagName || 'Tin tức'}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {calculateReadTime(blog.content)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                  {createTitle(blog.content)}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {createExcerpt(blog.content)}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {formatDate(blog.postDate)}
                  </div>
                  <button
                    onClick={() => handleReadMore(blog.blogId)}
                    className="text-red-600 font-semibold text-sm hover:text-red-700 transition-colors flex items-center"
                  >
                    Đọc thêm
                    <ArrowRightIcon className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <NewspaperIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Khám phá thêm tin tức</h3>
              <p className="text-lg sm:text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                Cập nhật thường xuyên những tin tức, kiến thức và sự kiện mới nhất về hiến máu.
              </p>

              <button
                onClick={handleViewAllNews}
                className="bg-white text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 transition-all duration-200 transform hover:scale-105 inline-flex items-center shadow-lg"
              >
                Xem tất cả tin tức
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsSection