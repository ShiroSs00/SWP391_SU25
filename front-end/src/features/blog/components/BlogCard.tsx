import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Eye, Edit, Trash2, Heart } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuth';
import type { BlogPost } from '../types/blog.types';
import { BLOG_TAGS } from '../types/blog.types';

interface BlogCardProps {
  blog: BlogPost;
  onView: (blog: BlogPost) => void;
  onEdit?: (blog: BlogPost) => void;
  onDelete?: (blog: BlogPost) => void;
  showActions?: boolean;
  className?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  className = '',
}) => {
  const { canEditPost, canDeletePost } = useAuthStore();

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Không xác định';
    }
  };

  const getTagStyle = (tagName: string) => {
    const tag = BLOG_TAGS.find(t => t.name === tagName);
    return tag ? tag.color : 'bg-gray-100 text-gray-800';
  };

  const getPreviewContent = (content: string, maxLength: number = 150) => {
    // Remove markdown syntax for preview
    const cleanContent = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/!\[(.*?)\]\(.*?\)/g, '') // Remove images
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();

    return cleanContent.length > maxLength 
      ? cleanContent.substring(0, maxLength) + '...' 
      : cleanContent;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden group cursor-pointer ${className}`}
      onClick={() => onView(blog)}
    >
      {/* Thumbnail */}
      {blog.thumbnail && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={blog.thumbnail}
            alt="Blog thumbnail"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div className="p-6">
        {/* Tag */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTagStyle(blog.tagName)}`}>
            {blog.tagName}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Heart className="w-4 h-4 mr-1" />
            <span>Hiến máu</span>
          </div>
        </div>

        {/* Content Preview */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed text-sm">
            {getPreviewContent(blog.content)}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(blog.postDate)}</span>
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>ID: {blog.accountId}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(blog);
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Eye className="w-4 h-4 mr-1" />
              <span>Xem chi tiết</span>
            </button>

            <div className="flex items-center space-x-2">
              {canEditPost(blog.accountId) && onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(blog);
                  }}
                  className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  <span>Sửa</span>
                </button>
              )}

              {canDeletePost(blog.accountId) && onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(blog);
                  }}
                  className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  <span>Xóa</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};