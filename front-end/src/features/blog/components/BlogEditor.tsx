import React, { useState } from 'react';
import { Save, Eye, Upload, Tag, Calendar } from 'lucide-react';
import { BlogForm, BlogCategory } from '../types/blog.types';

interface BlogEditorProps {
  initialData?: Partial<BlogForm>;
  onSave: (data: BlogForm) => Promise<void>;
  onPreview?: (data: BlogForm) => void;
  loading?: boolean;
}

const categoryOptions = [
  { value: 'blood_education', label: 'Giáo dục về máu' },
  { value: 'donation_tips', label: 'Mẹo hiến máu' },
  { value: 'health_wellness', label: 'Sức khỏe' },
  { value: 'success_stories', label: 'Câu chuyện thành công' },
  { value: 'medical_research', label: 'Nghiên cứu y khoa' },
  { value: 'community', label: 'Cộng đồng' },
  { value: 'news', label: 'Tin tức' },
  { value: 'events', label: 'Sự kiện' }
];

const BlogEditor: React.FC<BlogEditorProps> = ({
  initialData,
  onSave,
  onPreview,
  loading = false
}) => {
  const [formData, setFormData] = useState<BlogForm>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    category: initialData?.category || 'blood_education',
    tags: initialData?.tags || [],
    status: initialData?.status || 'draft',
    featuredImage: initialData?.featuredImage,
    publishedAt: initialData?.publishedAt,
    seoTitle: initialData?.seoTitle,
    seoDescription: initialData?.seoDescription
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<BlogForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BlogForm> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung là bắt buộc';
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Tóm tắt là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving blog post:', error);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </h2>
          <div className="flex items-center gap-3">
            {onPreview && (
              <button
                type="button"
                onClick={() => onPreview(formData)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Xem trước
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Đang lưu...' : 'Lưu bài viết'}
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Nhập tiêu đề bài viết..."
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Category and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                category: e.target.value as BlogCategory 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                status: e.target.value as any 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản</option>
              <option value="scheduled">Lên lịch</option>
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tóm tắt *
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            placeholder="Viết tóm tắt ngắn gọn về bài viết..."
          />
          {errors.excerpt && (
            <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            placeholder="Viết nội dung bài viết..."
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thẻ tag
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-2"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Nhập tag và nhấn Enter..."
          />
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh đại diện
          </label>
          <div className="flex items-center gap-4">
            <input
              type="url"
              value={formData.featuredImage || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                featuredImage: e.target.value || undefined 
              }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="URL ảnh đại diện..."
            />
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Tải lên
            </button>
          </div>
          {formData.featuredImage && (
            <img
              src={formData.featuredImage}
              alt="Preview"
              className="mt-2 w-32 h-20 object-cover rounded-md"
            />
          )}
        </div>

        {/* SEO Settings */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt SEO</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề SEO
              </label>
              <input
                type="text"
                value={formData.seoTitle || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  seoTitle: e.target.value || undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Tiêu đề tối ưu cho SEO..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả SEO
              </label>
              <textarea
                value={formData.seoDescription || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  seoDescription: e.target.value || undefined 
                }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Mô tả ngắn gọn cho công cụ tìm kiếm..."
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;