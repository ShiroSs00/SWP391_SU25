import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../hooks/useBlogs.ts';
import type { BlogPost, BlogForm, EditPostPageProps } from '../types/blog.types';
import BlogEditor from "../components/BlogEditor.tsx";
const EditPostPage: React.FC<EditPostPageProps> = ({ postId }) => {
    const navigate = useNavigate();
    const { updatePost, loading } = useBlog();
    const [post] = useState<BlogPost | null>(null);
    const [loadingPost, setLoadingPost] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // This would typically use a getPostById method
                // For now, we'll simulate loading
                setLoadingPost(false);
            } catch (error) {
                console.error('Error fetching post:', error);
                setLoadingPost(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleSave = async (data: BlogForm) => {
        try {
            const updatedPost = await updatePost(postId, data);
            // Navigate to the updated post
            navigate(`/blog/${updatedPost.slug}`); // Sử dụng navigate thay cho window.location.href
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handlePreview = (data: BlogForm) => {
        // Open preview in new tab or modal
        console.log('Preview:', data);
    };

    const handleBack = () => {
        navigate(-1); // Sử dụng navigate(-1) thay cho window.history.back()
    };

    if (loadingPost) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải bài viết...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại</span>
                </button>

                {/* Editor */}
                <BlogEditor
                    initialData={post ? {
                        title: post.title,
                        content: post.content,
                        excerpt: post.excerpt,
                        category: post.category,
                        tags: post.tags,
                        status: post.status,
                        featuredImage: post.featuredImage,
                        publishedAt: post.publishedAt,
                        seoTitle: post.seoTitle,
                        seoDescription: post.seoDescription
                    } : undefined}
                    onSave={handleSave}
                    onPreview={handlePreview}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default EditPostPage;


