import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, User, Edit, Trash2, Heart, Share2 } from 'lucide-react';
import { blogService } from '../services/blog.service';
import { useAuthStore } from '../hooks/useAuth';
import type { BlogPost } from '../types/blog.types';
import { BLOG_TAGS } from '../types/blog.types';
import toast from 'react-hot-toast';
import { de } from 'date-fns/locale';

interface BlogDetailPageProps {
  onEdit: (blog: BlogPost) => void;
  onDelete: (blog: BlogPost) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ onEdit, onDelete }) => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, canEditPost, canDeletePost } = useAuthStore();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // // Redirect to login if not authenticated
    // if (!isAuthenticated) {
    //   toast.error('Vui lòng đăng nhập để xem chi tiết bài viết');
    //   navigate('/login');
    //   return;
    // }

    if (!blogId) {
      setError('ID bài viết không hợp lệ');
      setLoading(false);
      return;
    }

    fetchBlogDetail();
  }, [blogId, isAuthenticated, navigate]);

  const fetchBlogDetail = async () => {
    if (!blogId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getBlogById(blogId);
      setBlog(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải chi tiết bài viết';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/blogs');
  };

  const handleEdit = () => {
    if (blog) {
      onEdit(blog);
    }
  };

  const handleDelete = () => {
    if (blog) {
      onDelete(blog);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Blog Hiến Máu',
          text: blog?.content.substring(0, 100) + '...',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Đã sao chép link bài viết!');
      }
    } catch (error) {
      toast.error('Không thể chia sẻ bài viết');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Không xác định';
    }
  };

  const getTagStyle = (tagName: string) => {
    const tag = BLOG_TAGS.find(t => t.name === tagName);
    return tag ? tag.color : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-8"></div>
            <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-red-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Không thể tải bài viết</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBack}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách blog</span>
        </motion.button>

        {/* Article */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            {/* Tag */}
            <div className="flex items-center justify-between mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTagStyle(blog.tagName)}`}>
                {blog.tagName}
              </span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Chia sẻ</span>
                </button>
                {canEditPost(blog.accountId) && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
                {canDeletePost(blog.accountId) && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                  </button>
                )}
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex items-center space-x-6 text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.postDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Tác giả: {blog.accountId}</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {blog.img && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={blog.img}
                alt="Blog cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-6 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-lg">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2 text-lg">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-red-500 bg-red-50 pl-6 py-4 italic text-gray-700 my-8 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-8">
                      {children}
                    </pre>
                  ),
                  img: ({ src, alt }) => (
                    <img
                      src={src}
                      alt={alt}
                      className="w-full rounded-lg shadow-md my-8"
                    />
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-800 underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Cảm ơn bạn đã chia sẻ kinh nghiệm hiến máu!</span>
              </div>
              <button
                onClick={handleBack}
                className="text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Xem thêm bài viết khác
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogDetailPage