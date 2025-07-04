import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { BlogEditor } from '../components/BlogEditor';
import { blogService } from '../services/blog.service';
import { useAuth } from '../hooks/useAuth';
import type {BlogPost, CreateBlogRequest} from '../types/blog.types';
import toast from 'react-hot-toast';

interface CreatePostPageProps {
    onBack: () => void;
    onSuccess: () => void;
    className?: string;
}

export const CreatePostPage: React.FC<CreatePostPageProps> = ({
                                                                  onBack,
                                                                  onSuccess,
                                                                  className = ''
                                                              }) => {
    const { canCreatePost } = useAuth();
    const [loading, setLoading] = useState(false);

    // Check permissions
    if (!canCreatePost()) {
        return (
            <div className={`min-h-screen bg-gray-50 ${className}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={onBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Quay lại
                    </button>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Không có quyền truy cập</h2>
                        <p className="text-gray-600 mb-4">
                            Bạn cần có quyền Staff hoặc Admin để tạo bài viết mới.
                        </p>
                        <button
                            onClick={onBack}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSave = async (data: CreateBlogRequest): Promise<{ success: boolean; blogId?: string }> => {
        try {
            setLoading(true);
            const response: BlogPost = await blogService.createBlog(data);

            toast.success('Tạo bài viết thành công!');
            // Navigate to blog list after successful creation
            setTimeout(() => {
                onSuccess(); // This should navigate to blog list
            }, 1000);
            return { success:true, blogId: response.id};
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo bài viết';
            toast.error(errorMessage);
            return { success: false} ;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <motion.button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
                    whileHover={{ x: -4 }}
                    transition={{ duration: 0.2 }}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Quay lại danh sách
                </motion.button>

                {/* Editor */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <BlogEditor
                        onSave={handleSave}
                        onCancel={onBack}
                        loading={loading}
                        isEditing={false}
                    />
                </motion.div>
            </div>
        </div>
    );
};