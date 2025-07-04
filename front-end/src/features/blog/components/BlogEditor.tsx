import React, { useState, useEffect } from 'react';
import { Save, Eye, X, Image as ImageIcon, Send, FileText, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BLOG_TAGS, type BlogTag, type CreateBlogRequest } from '../types/blog.types';
import toast from 'react-hot-toast';

interface BlogEditorProps {
  initialData?: Partial<CreateBlogRequest>;
  onSave: (data: CreateBlogRequest) => Promise<{ success: boolean; blogId?: string }>;
  onCancel: () => void;
  isEditing?: boolean;
  loading?: boolean;
  className?: string;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
                                                        initialData,
                                                        onSave,
                                                        onCancel,
                                                        isEditing = false,
                                                        loading = false,
                                                        className = ''
                                                      }) => {
  const [formData, setFormData] = useState<CreateBlogRequest>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    summary: initialData?.summary || '',
    coverImage: initialData?.coverImage || '',
    tags: initialData?.tags || [],
    isPublished: initialData?.isPublished ?? true,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData?.title || '',
        content: initialData?.content || '',
        summary: initialData?.summary || '',
        coverImage: initialData?.coverImage || '',
        tags: initialData?.tags || [],
        isPublished: initialData?.isPublished ?? true,
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung không được để trống';
    } else if (formData.content.length < 100) {
      newErrors.content = 'Nội dung phải có ít nhất 100 ký tự';
    }

    if (formData.summary && formData.summary.length > 500) {
      newErrors.summary = 'Tóm tắt không được vượt quá 500 ký tự';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'Vui lòng chọn ít nhất một thẻ';
    } else if (formData.tags.length > 5) {
      newErrors.tags = 'Không được chọn quá 5 thẻ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publishStatus: boolean) => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSave = { ...formData, isPublished: publishStatus } as CreateBlogRequest;
      const result = await onSave(dataToSave);

      if (result.success) {
        const message = publishStatus
            ? (isEditing ? 'Cập nhật và xuất bản thành công!' : 'Xuất bản bài viết thành công!')
            : (isEditing ? 'Cập nhật nháp thành công!' : 'Lưu nháp thành công!');

        toast.success(message);

        // Navigate back to blog list after successful save
        setTimeout(() => {
          onCancel(); // This should navigate back to the blog list
        }, 1500);
      }
    } catch {
      const errorMessage = publishStatus
          ? 'Có lỗi xảy ra khi xuất bản. Vui lòng thử lại!'
          : 'Có lỗi xảy ra khi lưu nháp. Vui lòng thử lại!';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagToggle = (tag: BlogTag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
    }));
  };

  const handleImageUrlAdd = () => {
    const url = prompt('Nhập URL hình ảnh:');
    if (url) {
      setFormData(prev => ({ ...prev, coverImage: url }));
    }
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const beforeText = textarea.value.substring(0, start);
      const afterText = textarea.value.substring(end);

      let newText = '';
      switch (syntax) {
        case 'bold':
          newText = `${beforeText}**${selectedText || 'văn bản đậm'}**${afterText}`;
          break;
        case 'italic':
          newText = `${beforeText}_${selectedText || 'văn bản nghiêng'}_${afterText}`;
          break;
        case 'heading':
          newText = `${beforeText}## ${selectedText || 'Tiêu đề'}\n${afterText}`;
          break;
        case 'list':
          newText = `${beforeText}- ${selectedText || 'Mục danh sách'}\n${afterText}`;
          break;
        case 'link':
          newText = `${beforeText}[${selectedText || 'văn bản liên kết'}](URL)${afterText}`;
          break;
        case 'image':
          newText = `${beforeText}![${selectedText || 'mô tả ảnh'}](URL_ảnh)${afterText}`;
          break;
        default:
          return;
      }

      setFormData(prev => ({ ...prev, content: newText }));

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + syntax.length + 2, start + syntax.length + 2);
      }, 0);
    }
  };

  const isDisabled = loading || isSubmitting;

  return (
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {isEditing ? 'Cập nhật thông tin bài viết' : 'Chia sẻ kiến thức với cộng đồng'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200"
                  disabled={isDisabled}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Chỉnh sửa' : 'Xem trước'}
              </button>
              <button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
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
                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                    Tiêu đề bài viết *
                  </label>
                  <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-lg font-medium ${
                          errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`}
                      placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                      disabled={isDisabled}
                  />
                  {errors.title && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="w-4 h-4 mr-1">⚠️</span>
                        {errors.title}
                      </p>
                  )}
                  <p className="text-xs text-gray-500">{formData.title.length}/200 ký tự</p>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <label htmlFor="summary" className="block text-sm font-semibold text-gray-700">
                    Tóm tắt bài viết
                  </label>
                  <textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none ${
                          errors.summary ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`}
                      rows={3}
                      placeholder="Viết tóm tắt ngắn gọn để thu hút người đọc..."
                      disabled={isDisabled}
                  />
                  {errors.summary && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="w-4 h-4 mr-1">⚠️</span>
                        {errors.summary}
                      </p>
                  )}
                  <p className="text-xs text-gray-500">{formData.summary?.length || 0}/500 ký tự</p>
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Ảnh bìa
                  </label>
                  <div className="flex space-x-3">
                    <input
                        type="url"
                        value={formData.coverImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder="https://example.com/image.jpg"
                        disabled={isDisabled}
                    />
                    <button
                        type="button"
                        onClick={handleImageUrlAdd}
                        className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors border-2 border-gray-200"
                        disabled={isDisabled}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Chọn ảnh
                    </button>
                  </div>
                  {formData.coverImage && (
                      <div className="mt-4">
                        <img
                            src={formData.coverImage}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                        />
                      </div>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Thẻ bài viết * <span className="text-gray-500 font-normal">(Chọn 1-5 thẻ)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BLOG_TAGS.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                formData.tags.includes(tag)
                                    ? 'bg-primary-600 text-white shadow-md transform scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                            }`}
                            disabled={isDisabled || (!formData.tags.includes(tag) && formData.tags.length >= 5)}
                        >
                          {tag}
                        </button>
                    ))}
                  </div>
                  {errors.tags && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="w-4 h-4 mr-1">⚠️</span>
                        {errors.tags}
                      </p>
                  )}
                  <p className="text-xs text-gray-500">Đã chọn {formData.tags.length}/5 thẻ</p>
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
                          onClick={() => insertMarkdown('bold')}
                          className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-bold"
                          title="Đậm"
                          disabled={isDisabled}
                      >
                        B
                      </button>
                      <button
                          type="button"
                          onClick={() => insertMarkdown('italic')}
                          className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors italic"
                          title="Nghiêng"
                          disabled={isDisabled}
                      >
                        I
                      </button>
                      <button
                          type="button"
                          onClick={() => insertMarkdown('heading')}
                          className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-bold"
                          title="Tiêu đề"
                          disabled={isDisabled}
                      >
                        H
                      </button>
                      <button
                          type="button"
                          onClick={() => insertMarkdown('list')}
                          className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Danh sách"
                          disabled={isDisabled}
                      >
                        •
                      </button>
                      <button
                          type="button"
                          onClick={() => insertMarkdown('link')}
                          className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Liên kết"
                          disabled={isDisabled}
                      >
                        🔗
                      </button>
                      <button
                          type="button"
                          onClick={() => insertMarkdown('image')}
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
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none font-mono text-sm leading-relaxed ${
                          errors.content ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
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
                  <p className="text-xs text-gray-500">
                    {formData.content.length} ký tự (tối thiểu 100 ký tự)
                  </p>
                </div>
              </div>
          ) : (
              /* Preview */
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {formData.title || 'Tiêu đề bài viết'}
                  </h1>
                  {formData.summary && (
                      <p className="text-xl text-gray-600 leading-relaxed">{formData.summary}</p>
                  )}
                  {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-6">
                        {formData.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                            >
                      {tag}
                    </span>
                        ))}
                      </div>
                  )}
                </div>

                {formData.coverImage && (
                    <img
                        src={formData.coverImage}
                        alt="Cover"
                        className="w-full h-64 object-cover rounded-xl"
                    />
                )}

                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{children}</h3>,
                        p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4 text-lg">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 text-lg">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2 text-lg">{children}</ol>,
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-primary-500 bg-primary-50 pl-6 py-4 italic text-gray-700 my-6 rounded-r-lg">
                              {children}
                            </blockquote>
                        ),
                        code: ({ children }) => (
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                              {children}
                            </code>
                        ),
                        pre: ({ children }) => (
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-6">
                      {children}
                    </pre>
                        ),
                      }}
                  >
                    {formData.content || 'Nội dung bài viết sẽ hiển thị ở đây...'}
                  </ReactMarkdown>
                </div>
              </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    disabled={isDisabled}
                />
                <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                  Xuất bản ngay lập tức
                </label>
              </div>
            </div>

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
                  onClick={() => handleSubmit(false)}
                  disabled={isDisabled}
                  className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Đang lưu...' : 'Lưu nháp'}
              </button>
              <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={isDisabled}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              >
                <Send className="w-4 h-4 mr-2" />
                <Sparkles className="w-4 h-4 mr-1" />
                {isSubmitting ? 'Đang xuất bản...' : 'Xuất bản'}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};