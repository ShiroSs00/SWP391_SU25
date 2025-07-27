import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogListPage } from './BlogListPage';
import { BlogDetailPage } from './BlogDetailPage';
import { BlogEditor } from '../components/BlogEditor';
import { blogService } from '../services/blog.service';
import { useAuthStore } from '../hooks/useAuth';
import type { BlogPost, CreateBlogRequest, UpdateBlogRequest } from '../types/blog.types';
import toast from 'react-hot-toast';

type ViewMode = 'list' | 'detail' | 'create' | 'edit';

interface BlogManagementPageProps {
  initialViewMode?: ViewMode;
  blogId?: string;
  onBack?: () => void;
  onSuccess?: (blogId: string) => void;
  onCreatePost?: () => void;
  onViewPost?: (blog: BlogPost) => void;
  onEditPost?: (blog: BlogPost) => void;
}

export const BlogManagementPage: React.FC<BlogManagementPageProps> = ({
  initialViewMode = 'list',
  blogId,
  onBack,
  onSuccess,
  onCreatePost,
  onViewPost,
  onEditPost,
}) => {
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);

  // Load blog details for detail/edit mode
  React.useEffect(() => {
    if (blogId && (viewMode === 'detail' || viewMode === 'edit')) {
      const fetchBlog = async () => {
        try {
          setLoading(true);
          const blog = await blogService.getBlogById(blogId);
          setSelectedBlog(blog);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Không thể tải bài viết';
          toast.error(errorMessage);
          if (onBack) onBack();
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [blogId, viewMode, onBack]);

  const handleCreatePost = () => {
    if (onCreatePost) {
      onCreatePost();
    } else {
      setViewMode('create');
      setSelectedBlog(null);
    }
  };

  const handleViewPost = (blog: BlogPost) => {
    if (onViewPost) {
      onViewPost(blog);
    } else {
      setSelectedBlog(blog);
      setViewMode('detail');
    }
  };

  const handleEditPost = (blog: BlogPost) => {
    if (onEditPost) {
      onEditPost(blog);
    } else {
      setSelectedBlog(blog);
      setViewMode('edit');
    }
  };

  const handleDeletePost = async (blog: BlogPost) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    try {
      setLoading(true);
      await blogService.deleteBlog(blog.blogId);
      toast.success('Xóa bài viết thành công!');
      if (onBack) onBack();
      else setViewMode('list');
      setSelectedBlog(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể xóa bài viết';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBlog = async (data: CreateBlogRequest | UpdateBlogRequest): Promise<{ success: boolean; blogId?: string }> => {
    try {
      setLoading(true);

      if (viewMode === 'create') {
        const createData: CreateBlogRequest = {
          ...data,
          accountId: user?.id || data.accountId,
        };
        const result = await blogService.createBlog(createData);
        toast.success('Tạo bài viết thành công!');
        if (onSuccess) onSuccess(result.blogId);
        return { success: true, blogId: result.blogId };
      } else if (viewMode === 'edit' && selectedBlog) {
        const updateData: UpdateBlogRequest = {
          ...data,
          blogId: selectedBlog.blogId,
          accountId: user?.id || data.accountId,
        };
        await blogService.updateBlog(selectedBlog.blogId, updateData);
        toast.success('Cập nhật bài viết thành công!');
        if (onSuccess) onSuccess(selectedBlog.blogId);
        return { success: true, blogId: selectedBlog.blogId };
      }

      return { success: false };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      toast.error(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onBack) onBack();
    else {
      setViewMode('list');
      setSelectedBlog(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BlogListPage
              onCreatePost={handleCreatePost}
              onViewPost={handleViewPost}
              onEditPost={handleEditPost}
            />
          </motion.div>
        )}

        {viewMode === 'detail' && selectedBlog && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <BlogDetailPage
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          </motion.div>
        )}

        {(viewMode === 'create' || viewMode === 'edit') && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gray-50 py-8"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <BlogEditor
                initialData={selectedBlog || undefined}
                onSave={handleSaveBlog}
                onCancel={handleCancel}
                isEditing={viewMode === 'edit'}
                loading={loading}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};