// BlogList.tsx
import React from 'react';
import type { BlogPost } from '../types/blog.types';

// Cập nhật interface BlogListProps
interface BlogListProps {
  blogs: BlogPost[];
  onBlogClick: (blog: BlogPost) => void;
  onEditPost: (blog: BlogPost) => void; // Thêm prop này
  loading: boolean;
  className?: string;
}

export const BlogList: React.FC<BlogListProps> = ({
                                                    blogs,
                                                    onBlogClick,
                                                    onEditPost, // Thêm vào destructuring
                                                    loading,
                                                    className = ''
                                                  }) => {
  if (loading) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
          {/* Loading skeleton */}
          {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
          ))}
        </div>
    );
  }

  if (blogs.length === 0) {
    return (
        <div className={`text-center py-12 ${className}`}>
          <div className="text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl font-medium">Không có bài viết nào</p>
            <p className="text-gray-400 mt-2">Hãy thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
          </div>
        </div>
    );
  }

  return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {blogs.map((blog) => (
            <div
                key={blog.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                onClick={() => onBlogClick(blog)}
            >
              {/* Blog image */}
              {blog.coverImage && (
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                  </div>
              )}

              <div className="p-6">
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.slice(0, 3).map((tag) => (
                          <span
                              key={tag}
                              className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium"
                          >
                                        {tag}
                                    </span>
                      ))}
                      {blog.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        +{blog.tags.length - 3}
                                    </span>
                      )}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {blog.title}
                </h3>

                {/* Summary */}
                {blog.summary && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.summary}
                    </p>
                )}

                {/* Meta info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                                <span>
                                    {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                    {blog.viewCount && (
                        <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                          {blog.viewCount}
                                    </span>
                    )}
                  </div>

                  {/* Edit button */}
                  <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering onBlogClick
                        onEditPost(blog);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Chỉnh sửa bài viết"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
        ))}
      </div>
  );
};