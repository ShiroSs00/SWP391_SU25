import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Save, Eye, X, ImageIcon, FileText, Upload, Image as ImageIconLarge } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { BLOG_TAGS, type CreateBlogRequest, type UpdateBlogRequest, type BlogPost } from "../types/blog.types"
import toast from "react-hot-toast"

interface BlogEditorProps {
  initialData?: Partial<BlogPost>
  onSave: (data: CreateBlogRequest | UpdateBlogRequest) => Promise<{ success: boolean; blogId?: string }>
  onCancel: () => void
  isEditing?: boolean
  loading?: boolean
  className?: string
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  isEditing = false,
  loading = false,
  className = "",
}) => {
  const [formData, setFormData] = useState<CreateBlogRequest>({
    content: initialData?.content || "",
    img: initialData?.img || "",
    thumbnail: initialData?.thumbnail || "",
    tagName: initialData?.tagName || BLOG_TAGS[0]?.name || "",
    accountId: initialData?.accountId || "",
    blogId: initialData?.blogId || "",
    postDate: initialData?.postDate || new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
  })

  const [showPreview, setShowPreview] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<{
    img: File | null
    thumbnail: File | null
  }>({
    img: null,
    thumbnail: null
  })

  const imgFileInputRef = useRef<HTMLInputElement>(null)
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        content: initialData?.content || "",
        img: initialData?.img || "",
        thumbnail: initialData?.thumbnail || "",
        tagName: initialData?.tagName || BLOG_TAGS[0]?.name || "",
        accountId: initialData?.accountId || "",
        blogId: initialData?.blogId || "",
        postDate: initialData?.postDate || new Date().toISOString().split('T')[0],
      })
    }
  }, [initialData])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.content.trim()) {
      newErrors.content = "Nội dung không được để trống"
    } else if (formData.content.length < 100) {
      newErrors.content = "Nội dung phải có ít nhất 100 ký tự"
    }

    if (!formData.tagName) {
      newErrors.tagName = "Vui lòng chọn thẻ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin")
      return
    }

    setIsSubmitting(true)
    try {
      // Chuẩn bị dữ liệu với format đúng
      const dataToSave = {
        ...formData,
        postDate: new Date(formData.postDate).toISOString(), // Đảm bảo format ISO
        content: formData.content.trim(),
        accountId: formData.accountId.trim(),
        img: formData.img || null,
        thumbnail: formData.thumbnail || null,
        ...(isEditing && { blogId: initialData?.blogId || "" })
      }

      console.log("Sending data:", dataToSave) // Debug log

      const result = await onSave(dataToSave as CreateBlogRequest | UpdateBlogRequest)

      if (result.success) {
        const message = isEditing ? "Cập nhật bài viết thành công!" : "Tạo bài viết thành công!"
        toast.success(message)

        setTimeout(() => {
          onCancel()
        }, 1500)
      } else {
        toast.error("Có lỗi xảy ra khi lưu bài viết")
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUrlAdd = (field: "img" | "thumbnail") => {
    const url = prompt(`Nhập URL ${field === "img" ? "ảnh bìa" : "thumbnail"}:`)
    if (url) {
      setFormData((prev) => ({ ...prev, [field]: url }))
      // Reset file khi dùng URL
      setImageFiles(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleFileSelect = (field: "img" | "thumbnail") => {
    const input = field === "img" ? imgFileInputRef.current : thumbnailFileInputRef.current
    if (input) {
      input.click()
    }
  }

  const handleFileChange = (field: "img" | "thumbnail", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Vui lòng chọn file hình ảnh")
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File quá lớn. Vui lòng chọn file dưới 5MB")
        return
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, [field]: previewUrl }))
      setImageFiles(prev => ({ ...prev, [field]: file }))
    }
  }

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = textarea.value.substring(start, end)
      const beforeText = textarea.value.substring(0, start)
      const afterText = textarea.value.substring(end)

      let newText = ""
      let cursorPosition = start

      switch (syntax) {
        case "bold":
          newText = `${beforeText}**${selectedText || "văn bản đậm"}**${afterText}`
          cursorPosition = start + 2 + (selectedText || "văn bản đậm").length + 2
          break
        case "italic":
          newText = `${beforeText}_${selectedText || "văn bản nghiêng"}_${afterText}`
          cursorPosition = start + 1 + (selectedText || "văn bản nghiêng").length + 1
          break
        case "heading":
          newText = `${beforeText}## ${selectedText || "Tiêu đề"}\n${afterText}`
          cursorPosition = start + 3 + (selectedText || "Tiêu đề").length
          break
        case "list":
          newText = `${beforeText}- ${selectedText || "Mục danh sách"}\n${afterText}`
          cursorPosition = start + 2 + (selectedText || "Mục danh sách").length
          break
        case "link":
          newText = `${beforeText}[${selectedText || "văn bản liên kết"}](URL)${afterText}`
          cursorPosition = start + 1 + (selectedText || "văn bản liên kết").length + 2
          break
        case "image":
          newText = `${beforeText}![${selectedText || "mô tả ảnh"}](URL_ảnh)${afterText}`
          cursorPosition = start + 2 + (selectedText || "mô tả ảnh").length + 2
          break
        default:
          return
      }

      setFormData((prev) => ({ ...prev, content: newText }))

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(cursorPosition, cursorPosition)
      }, 0)
    }
  }

  const isDisabled = loading || isSubmitting

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
              </h2>
              <p className="text-blue-100 mt-1">
                {isEditing ? "Cập nhật thông tin bài viết" : "Chia sẻ kiến thức với cộng đồng"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
              disabled={isDisabled}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Chỉnh sửa" : "Xem trước"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center px-4 py-2 text-white/80 hover:text-white transition-colors"
              disabled={isDisabled}
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {!showPreview ? (
          <div className="space-y-8">
            {/* Account ID */}
            {/* <div className="space-y-2">
              <label htmlFor="accountId" className="block text-sm font-semibold text-gray-700">
                Account ID *
              </label>
              <input
                type="text"
                id="accountId"
                value={formData.accountId}
                onChange={(e) => setFormData((prev) => ({ ...prev, accountId: e.target.value }))}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.accountId ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                }`}
                placeholder="Nhập Account ID..."
                disabled={isDisabled}
              />
              {errors.accountId && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 mr-1">⚠️</span>
                  {errors.accountId}
                </p>
              )}
            </div> */}

            {/* Post Date */}
            <div className="space-y-2">
              <label htmlFor="postDate" className="block text-sm font-semibold text-gray-700">
                Ngày đăng *
              </label>
              <input
                type="date"
                id="postDate"
                value={formData.postDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, postDate: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                disabled={isDisabled}
              />
            </div>

            {/* Tag */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Thẻ bài viết *</label>
              <div className="flex flex-wrap gap-2">
                {BLOG_TAGS.map((tag) => (
                  <button
                    key={tag.name}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, tagName: tag.name }))}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      formData.tagName === tag.name
                        ? "bg-blue-600 text-white shadow-md transform scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                    disabled={isDisabled}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
              {errors.tagName && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 mr-1">⚠️</span>
                  {errors.tagName}
                </p>
              )}
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Ảnh bìa</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Nhập URL</label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={formData.img}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, img: e.target.value }))
                        setImageFiles(prev => ({ ...prev, img: null }))
                      }}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="https://example.com/image.jpg"
                      disabled={isDisabled}
                    />
                    <button
                      type="button"
                      onClick={() => handleImageUrlAdd("img")}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                      disabled={isDisabled}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Hoặc chọn từ máy tính</label>
                  <button
                    type="button"
                    onClick={() => handleFileSelect("img")}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                    disabled={isDisabled}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn ảnh từ máy tính
                  </button>
                  <input
                    ref={imgFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("img", e)}
                    className="hidden"
                  />
                </div>
              </div>
              {formData.img && (
                <div className="mt-4 relative">
                  <img
                    src={formData.img}
                    alt="Cover Preview"
                    className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                  {imageFiles.img && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      File local
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Thumbnail</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Nhập URL</label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))
                        setImageFiles(prev => ({ ...prev, thumbnail: null }))
                      }}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="https://example.com/thumbnail.jpg"
                      disabled={isDisabled}
                    />
                    <button
                      type="button"
                      onClick={() => handleImageUrlAdd("thumbnail")}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                      disabled={isDisabled}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Hoặc chọn từ máy tính</label>
                  <button
                    type="button"
                    onClick={() => handleFileSelect("thumbnail")}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                    disabled={isDisabled}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn thumbnail
                  </button>
                  <input
                    ref={thumbnailFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("thumbnail", e)}
                    className="hidden"
                  />
                </div>
              </div>
              {formData.thumbnail && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail Preview"
                    className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                  {imageFiles.thumbnail && (
                    <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full">
                      Local
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="content-textarea" className="block text-sm font-semibold text-gray-700">
                  Nội dung bài viết * <span className="text-gray-500 font-normal">(Hỗ trợ Markdown)</span>
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => insertMarkdown("bold")}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-bold"
                    title="Đậm"
                    disabled={isDisabled}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("italic")}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors italic"
                    title="Nghiêng"
                    disabled={isDisabled}
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("heading")}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-bold"
                    title="Tiêu đề"
                    disabled={isDisabled}
                  >
                    H
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("list")}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Danh sách"
                    disabled={isDisabled}
                  >
                    •
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("link")}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Liên kết"
                    disabled={isDisabled}
                  >
                    🔗
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("image")}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Hình ảnh"
                    disabled={isDisabled}
                  >
                    📷
                  </button>
                </div>
              </div>
              <textarea
                id="content-textarea"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none font-mono text-sm leading-relaxed ${
                  errors.content ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                }`}
                rows={20}
                placeholder="Bắt đầu viết nội dung bài viết bằng Markdown...

Ví dụ:
# Tiêu đề chính
## Tiêu đề phụ
**Văn bản đậm**
*Văn bản nghiêng*
- Danh sách
[Liên kết](URL)
![Hình ảnh](URL)"
                disabled={isDisabled}
              />
              {errors.content && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 mr-1">⚠️</span>
                  {errors.content}
                </p>
              )}
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">{formData.content.length} ký tự (tối thiểu 100 ký tự)</p>
                <div className="flex items-center space-x-2">
                  {imageFiles.img && (
                    <span className="text-xs text-green-600 flex items-center">
                      <ImageIconLarge className="w-3 h-3 mr-1" />
                      Ảnh bìa đã chọn
                    </span>
                  )}
                  {imageFiles.thumbnail && (
                    <span className="text-xs text-purple-600 flex items-center">
                      <ImageIconLarge className="w-3 h-3 mr-1" />
                      Thumbnail đã chọn
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview */
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {formData.tagName}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {new Date(formData.postDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            {formData.img && (
              <img
                src={formData.img}
                alt="Cover"
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
            )}

            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4 text-lg">{children}</p>,
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 text-lg">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2 text-lg">{children}</ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-6 py-4 italic text-gray-700 my-6 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-6">
                      {children}
                    </pre>
                  ),
                }}
              >
                {formData.content || "Nội dung bài viết sẽ hiển thị ở đây..."}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              disabled={isDisabled}
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isDisabled}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo bài viết"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}