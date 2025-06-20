import React from 'react';
import { Calendar, User, Eye, Heart, MessageCircle, Clock } from 'lucide-react';
import { BlogPost } from '../types/blog.types';
import { formatDate, formatRelativeTime, truncateText } from '../../../utils/helpers';

interface BlogCardProps {
  post: BlogPost;
  onClick?: () => void;
  showExcerpt?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const categoryLabels = {
  blood_education: 'Giáo dục về máu',
  donation_tips: 'Mẹo hiến máu',
  health_wellness: 'Sức khỏe',
  success_stories: 'Câu chuyện thành công',
  medical_research: 'Nghiên cứu y khoa',
  community: 'Cộng đồng',
  news: 'Tin tức',
  events: 'Sự kiện'
};

const categoryColors = {
  blood_education: 'bg-blue-100 text-blue-800',
  donation_tips: 'bg-green-100 text-green-800',
  health_wellness: 'bg-purple-100 text-purple-800',
  success_stories: 'bg-yellow-100 text-yellow-800',
  medical_research: 'bg-indigo-100 text-indigo-800',
  community: 'bg-pink-100 text-pink-800',
  news: 'bg-red-100 text-red-800',
  events: 'bg-orange-100 text-orange-800'
};

const BlogCard: React.FC<BlogCardProps> = ({
  post,
  onClick,
  showExcerpt = true,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const titleClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  return (
    <article 
      className={`bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:border-red-300' : ''
      } ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-4 -mx-6 -mt-6">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[post.category]}`}>
          {categoryLabels[post.category]}
        </span>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{post.readingTime} phút đọc</span>
        </div>
      </div>

      {/* Title */}
      <h2 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${titleClasses[size]}`}>
        {post.title}
      </h2>

      {/* Excerpt */}
      {showExcerpt && post.excerpt && (
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {size === 'small' ? truncateText(post.excerpt, 100) : post.excerpt}
        </p>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{post.tags.length - 3} khác</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {/* Author & Date */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-red-600" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{formatRelativeTime(post.publishedAt || post.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentsCount}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;