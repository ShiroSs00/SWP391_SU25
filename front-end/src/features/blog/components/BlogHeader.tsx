import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, BookOpen } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuth';

interface BlogHeaderProps {
  onCreatePost: () => void;
  totalBlogs: number;
}

export const BlogHeader: React.FC<BlogHeaderProps> = ({ onCreatePost, totalBlogs }) => {
  const { canCreatePost } = useAuthStore();

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Blog Hiến Máu
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Chia sẻ kinh nghiệm, câu chuyện cảm động và kiến thức khoa học về hiến máu
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-lg font-medium">{totalBlogs} bài viết</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span className="text-lg font-medium">Cộng đồng hiến máu</span>
            </div>
          </div>

          {/* Create Post Button */}
          {canCreatePost() && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreatePost}
              className="inline-flex items-center space-x-3 bg-white text-red-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
              <span>Tạo bài viết mới</span>
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};