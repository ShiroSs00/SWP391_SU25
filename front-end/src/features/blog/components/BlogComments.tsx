import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Trash2, Reply } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useComments } from '../hooks/useComments';
import { useAuth } from '../hooks/useAuth';
import type { BlogComment } from '../types/blog.types';
import toast from 'react-hot-toast';

interface BlogCommentsProps {
  blogId: string;
  className?: string;
}

interface CommentItemProps {
  comment: BlogComment;
  blogId: string;
  onReply: (commentId: string) => void;
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, blogId, onReply, level = 0 }) => {
  const { user } = useAuth();
  const { deleteComment } = useComments();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return 'N/A';
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      await deleteComment(blogId, comment.id);
    }
  };

  const canDelete = user && (user.id === comment.userId || user.role === 'ADMIN' || user.role === 'STAFF');

  return (
    <motion.div
      className={`${level > 0 ? 'ml-8 mt-4' : 'mb-6'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-3">
        <img
          src={comment.userAvatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
          alt={comment.userName}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-900">{comment.userName}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Xóa bình luận"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
          
          {level < 2 && (
            <button
              onClick={() => onReply(comment.id)}
              className="mt-2 text-xs text-primary-600 hover:text-primary-800 flex items-center transition-colors"
            >
              <Reply className="w-3 h-3 mr-1" />
              Trả lời
            </button>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  blogId={blogId}
                  onReply={onReply}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const BlogComments: React.FC<BlogCommentsProps> = ({ blogId, className = '' }) => {
  const { user, canComment } = useAuth();
  const { getComments, addComment, getBlogInteraction } = useComments();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const comments = getComments(blogId);
  const interaction = getBlogInteraction(blogId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận');
      return;
    }

    if (!canComment()) {
      toast.error('Bạn cần đăng nhập để bình luận');
      return;
    }

    setIsSubmitting(true);
    
    const success = await addComment(blogId, newComment.trim(), replyTo || undefined);
    
    if (success) {
      setNewComment('');
      setReplyTo(null);
    }
    
    setIsSubmitting(false);
  };

  const handleReply = (commentId: string) => {
    if (!canComment()) {
      toast.error('Bạn cần đăng nhập để trả lời bình luận');
      return;
    }
    setReplyTo(commentId);
    // Focus on textarea
    const textarea = document.getElementById('comment-textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  const cancelReply = () => {
    setReplyTo(null);
    setNewComment('');
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <MessageCircle className="w-5 h-5 text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          Bình luận ({interaction.commentCount})
        </h3>
      </div>

      {/* Comment Form */}
      {canComment() ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {replyTo && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  Đang trả lời bình luận
                </span>
                <button
                  type="button"
                  onClick={cancelReply}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt={user?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                id="comment-textarea"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyTo ? "Viết trả lời..." : "Viết bình luận..."}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                rows={3}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">
                  {newComment.length}/500 ký tự
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim() || newComment.length > 500}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Đang gửi...' : replyTo ? 'Trả lời' : 'Bình luận'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            Bạn cần đăng nhập để có thể bình luận
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                blogId={blogId}
                onReply={handleReply}
              />
            ))
          ) : (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có bình luận nào</p>
              <p className="text-sm text-gray-400 mt-1">
                Hãy là người đầu tiên bình luận về bài viết này
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};