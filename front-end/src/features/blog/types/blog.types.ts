export interface BlogPost {
  blogId: string
  content: string
  postDate: string
  img: string
  tagName: string
  accountId: string
  thumbnail: string
}

export interface CreateBlogRequest {
  blogId: string
  content: string
  postDate: string
  tagName: string
  img: string
  accountId: string
  thumbnail: string
}

export interface UpdateBlogRequest extends CreateBlogRequest {
  blogId: string
}

export interface BlogListResponse {
  blogs: BlogPost[]
  total: number
  page: number
  limit: number
}

export type UserRole = "MEMBER" | "STAFF" | "ADMIN"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
}

export interface BlogFilters {
  search?: string
  tags?: string[]
  sortBy?: "postDate" | "content"
  sortOrder?: "asc" | "desc"
}

export const BLOG_TAGS = [
  { name: "Kinh nghiệm hiến máu", color: "bg-blue-100 text-blue-800" },
  { name: "Thông tin khoa học", color: "bg-green-100 text-green-800" },
  { name: "Câu chuyện cảm động", color: "bg-purple-100 text-purple-800" },
  { name: "Hướng dẫn", color: "bg-yellow-100 text-yellow-800" },
  { name: "Sự kiện", color: "bg-pink-100 text-pink-800" },
  { name: "Tin tức", color: "bg-red-100 text-red-800" },
] as const

export type BlogTag = (typeof BLOG_TAGS)[number]["name"]
