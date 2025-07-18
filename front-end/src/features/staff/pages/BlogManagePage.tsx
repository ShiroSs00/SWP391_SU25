import React, { useState } from 'react';
import BlogManage from '../components/blogmanage';
import BlogCreate from '../components/blogcreate';

const BlogManagePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-8">
                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-lg mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                                    activeTab === 'create'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Tạo Blog Mới
                            </button>
                            <button
                                onClick={() => setActiveTab('manage')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                                    activeTab === 'manage'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Quản lý Blog
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'create' && <BlogCreate />}
                    {activeTab === 'manage' && <BlogManage />}
                </div>
            </div>
        </div>
    );
};

export default BlogManagePage;
