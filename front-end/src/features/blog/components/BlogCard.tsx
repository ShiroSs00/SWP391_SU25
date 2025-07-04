import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Eye, Heart, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { BlogPost } from '../types/blog.types';
import { useComments } from '../hooks/useComments';

interface BlogCardProps {
  blog: BlogPost;
  onClick: () => void;
  className?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onClick, className = '' }) => {
  const { getBlogInteraction } = useComments();
  const interaction = getBlogInteraction(blog.id);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return 'N/A';
    }
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      'Câu chuyện': 'bg-blue-100 text-blue-800',
      'Kinh nghiệm': 'bg-green-100 text-green-800',
      'Y học': 'bg-purple-100 text-purple-800',
      'Tin tức': 'bg-red-100 text-red-800',
      'Hướng dẫn': 'bg-yellow-100 text-yellow-800',
      'Sự kiện': 'bg-pink-100 text-pink-800',
      'Thống kê': 'bg-indigo-100 text-indigo-800',
      'Nghiên cứu': 'bg-gray-100 text-gray-800',
    };
    return colors[tag] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.article
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group ${className}`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.coverImage || 'https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {blog.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
          {blog.tags.length > 2 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{blog.tags.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {blog.title}
        </h3>

        {/* Summary */}
        {blog.summary && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {blog.summary}
          </p>
        )}

        {/* Author & Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={blog.author.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt={blog.author.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{blog.author.name}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(blog.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {blog.viewCount !== undefined && (
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {blog.viewCount}
              </div>
            )}
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {interaction.likeCount}
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {interaction.commentCount}
            </div>
          </div>
          
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              blog.author.role === 'STAFF' ? 'bg-primary-100 text-primary-800' :
              blog.author.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {blog.author.role}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};