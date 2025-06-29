import React from 'react';
import { ArrowLeft } from 'lucide-react';
import BlogEditor from '../components/BlogEditor';
import { useBlog } from "../hooks/useBlogs";
import type { BlogForm } from "../types/blog.types";
import { useNavigate } from 'react-router-dom';



const CreatePostPage: React.FC = () => {
    const { createPost, loading } = useBlog();
    const navigate = useNavigate();

    const handleSave = async (data: BlogForm) => {
        try {
            const newPost = await createPost(data);
            // Navigate to the new post
            navigate(`/blog/${newPost.slug}`);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handlePreview = (data: BlogForm) => {
        // Open preview in new tab or modal
        console.log('Preview:', data);
    };

    const handleBack = () => {
        navigate(-1);
    };

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
                    onSave={handleSave}
                    onPreview={handlePreview}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default CreatePostPage;