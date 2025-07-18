"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { BlogCard } from "../components/BlogCard"
import { BlogHeader } from "../components/BlogHeader"
import { blogService } from "../services/blog.service"
import { useAuthStore } from "../hooks/useAuth"
import { BLOG_TAGS, type BlogPost, type BlogTag } from "../types/blog.types"
import toast from "react-hot-toast"

interface BlogListPageProps {
  onCreatePost: () => void
  onViewPost: (blog: BlogPost) => void
  onEditPost: (blog: BlogPost) => void
  className?: string
}

interface BlogFilters {
  search?: string
  tags?: BlogTag[]
  sortBy?: "postDate" | "content"
  sortOrder?: "asc" | "desc"
}

export const BlogListPage: React.FC<BlogListPageProps> = ({ onCreatePost, onViewPost, onEditPost, className = "" }) => {
  const { canCreatePost } = useAuthStore()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<BlogFilters>({
    sortBy: "postDate",
    sortOrder: "desc",
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const blogsPerPage = 12

  const token = localStorage.getItem("authToken") || ""

  // Fetch blogs from API
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await blogService.getAllBlogs(token)
      setBlogs(data)
      setFilteredBlogs(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi tải danh sách bài viết"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [token])

  // Apply filters and sorting
  const applyFilters = useCallback(() => {
    let result = [...blogs]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(
        (blog) => blog.content.toLowerCase().includes(searchTerm) || blog.tagName.toLowerCase().includes(searchTerm),
      )
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((blog) => filters.tags!.some((tag) => blog.tagName === tag))
    }

    // Sorting
    result.sort((a, b) => {
      const { sortBy = "postDate", sortOrder = "desc" } = filters
      let comparison = 0

      switch (sortBy) {
        case "postDate":
          comparison = new Date(a.postDate).getTime() - new Date(b.postDate).getTime()
          break
        case "content":
          comparison = a.content.localeCompare(b.content)
          break
        default:
          comparison = 0
      }

      return sortOrder === "desc" ? -comparison : comparison
    })

    setFilteredBlogs(result)
    setCurrentPage(1)
  }, [blogs, filters])

  // Initialize
  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  // Apply filters when they change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Pagination calculations
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)
  const startIndex = (currentPage - 1) * blogsPerPage
  const endIndex = startIndex + blogsPerPage
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, search: searchTerm.trim() || undefined }))
  }

  const handleTagFilter = (tag: BlogTag) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag) ? currentTags.filter((t) => t !== tag) : [...currentTags, tag]

    setFilters((prev) => ({ ...prev, tags: newTags.length > 0 ? newTags : undefined }))
  }

  const handleSortChange = (sortBy: "postDate" | "content", sortOrder: "asc" | "desc") => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      search: undefined,
      tags: undefined,
      sortBy: "postDate",
      sortOrder: "desc",
    })
  }

  const handleBlogClick = (blog: BlogPost) => {
    onViewPost(blog)
  }

  const handleEditPost = (blog: BlogPost) => {
    onEditPost(blog)
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <BlogHeader onCreatePost={onCreatePost} totalBlogs={filteredBlogs.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Tìm kiếm
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Bộ lọc
            </button>
          </form>

          {/* Filters */}
          {showFilters && (
            <motion.div
              className="border-t border-gray-200 pt-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Tags Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Lọc theo thẻ:</h3>
                <div className="flex flex-wrap gap-2">
                  {BLOG_TAGS.map((tag) => (
                    <button
                      key={`tag-filter-${tag.name}`}
                      onClick={() => handleTagFilter(tag.name)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filters.tags?.includes(tag.name)
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {tag.color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Sắp xếp theo:</h3>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split("-") as ["postDate" | "content", "asc" | "desc"]
                      handleSortChange(sortBy, sortOrder)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="postDate-desc">Mới nhất</option>
                    <option value="postDate-asc">Cũ nhất</option>
                    <option value="content-asc">Nội dung A-Z</option>
                    <option value="content-desc">Nội dung Z-A</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </motion.div>
          )}

          {/* Active Filters Display */}
          {(filters.search || filters.tags?.length) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Đang lọc:</span>

              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Tìm kiếm: "{filters.search}"
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, search: undefined }))}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.tags?.map((tag) => (
                <span
                  key={`active-tag-${tag}`}
                  className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {tag}
                  <button onClick={() => handleTagFilter(tag)} className="ml-2 text-primary-600 hover:text-primary-800">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">{loading ? "Đang tải..." : `Tìm thấy ${filteredBlogs.length} bài viết`}</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchBlogs}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Blog List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : paginatedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedBlogs.map((blog) => (
              <BlogCard
                key={blog.blogId}
                blog={blog}
                onView={handleBlogClick}
                onEdit={handleEditPost}
              // showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-8">
            <div className="text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xl font-medium">Không có bài viết nào</p>
              <p className="text-gray-400 mt-2">Hãy thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={`page-${page}`}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${page === currentPage
                    ? "bg-primary-600 text-white"
                    : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sau
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
