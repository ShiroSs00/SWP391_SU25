import api from '../../../services/axios/api';
import type { BlogPost, CreateBlogRequest, UpdateBlogRequest } from '../types/blog.types';

/**
 * Blog Service - Xử lý tất cả các API calls liên quan đến blog
 * Base URL: /api/blog
 */
export const blogService = {
    /**
     * Lấy danh sách tất cả bài viết
     * GET /api/blog/getall
     */
    getAllBlogs: async (token: string): Promise<BlogPost[]> => {
        try {
            const response = await api.get('/blog/getall', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Full response:', response);
            console.log('Response data:', response.data);
            console.log('Response data.data:', response.data.data);
            console.log('Response status:', response.status);


            return response.data.data;
        } catch (error: any) {
            console.error('Error fetching all blogs:', error);
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách bài viết');
        }
    },

    /**
     * Lấy chi tiết bài viết theo ID
     * GET /api/blog/getbyid/{id}
     */
    getBlogById: async (id: string): Promise<BlogPost> => {
        try {
            if (!id) {
                throw new Error('ID bài viết không được để trống');
            }
            const response = await api.get(`/blog/getbyid/${id}`);
            return response.data.data;
        } catch (error: any) {
            console.error('Error fetching blog by ID:', error);
            throw new Error(error.response?.data?.message || 'Không thể tải bài viết');
        }
    },

    /**
     * Lấy danh sách bài viết mới nhất
     * GET /api/blog/latest
     */
    getLatestBlogs: async (): Promise<BlogPost[]> => {
        try {
            const response = await api.get('/blog/latest');
            const data = response.data.data;
            return Array.isArray(data) ? data : [data];
        } catch (error: any) {
            console.error('Error fetching latest blogs:', error);
            throw new Error(error.response?.data?.message || 'Không thể tải bài viết mới nhất');
        }
    },

    /**
     * Tạo bài viết mới (yêu cầu quyền STAFF/ADMIN)
     * POST /api/blog/create
     */
    createBlog: async (blogData: CreateBlogRequest): Promise<BlogPost> => {
        try {
            // Validation phía client
            if (!blogData.content?.trim()) {
                throw new Error('Nội dung không được để trống');
            }

            const response = await api.post('/blog/create', blogData);
            return response.data.data;
        } catch (error: any) {
            console.error('Error creating blog:', error);
            throw new Error(error.response?.data?.message || 'Không thể tạo bài viết mới');
        }
    },

    /**
     * Cập nhật bài viết (yêu cầu quyền STAFF/ADMIN hoặc là tác giả)
     * PUT /api/blog/update/{id}
     */
    updateBlog: async (id: string, blogData: UpdateBlogRequest): Promise<BlogPost> => {
        try {
            if (!id) {
                throw new Error('ID bài viết không được để trống');
            }

            const response = await api.put(`/blog/update/${id}`, blogData);
            return response.data.data;
        } catch (error: any) {
            console.error('Error updating blog:', error);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật bài viết');
        }
    },

    /**
     * Xóa bài viết (yêu cầu quyền STAFF/ADMIN hoặc là tác giả)
     * DELETE /api/blog/delete/{id}
     */
    deleteBlog: async (id: string): Promise<void> => {
        try {
            if (!id) {
                throw new Error('ID bài viết không được để trống');
            }

            await api.delete(`/blog/delete/${id}`);
        } catch (error: any) {
            console.error('Error deleting blog:', error);
            throw new Error(error.response?.data?.message || 'Không thể xóa bài viết');
        }
    },

    /**
     * Xóa nhiều bài viết (yêu cầu quyền STAFF/ADMIN)
     * DELETE /api/blog/delete-multiple
     */
    deleteMultipleBlogs: async (ids: string[]): Promise<void> => {
        try {
            if (!ids || ids.length === 0) {
                throw new Error('Danh sách ID không được để trống');
            }

            await api.delete('/blog/delete-multiple', {
                data: { ids }
            });
        } catch (error: any) {
            console.error('Error deleting multiple blogs:', error);
            throw new Error(error.response?.data?.message || 'Không thể xóa nhiều bài viết');
        }
    },

    // ========== CLIENT-SIDE UTILITIES ==========
    // Các function sau đây được sử dụng để hỗ trợ tính năng client-side

    /**
     * Lấy danh sách blog IDs từ localStorage để khởi tạo interactions
     */
    getBlogInteractionsFromStorage: (): Record<string, any> => {
        try {
            const saved = localStorage.getItem('blogInteractions');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error reading blog interactions from localStorage:', error);
            return {};
        }
    },

    /**
     * Lưu blog interactions vào localStorage
     */
    saveBlogInteractionsToStorage: (interactions: Record<string, any>): void => {
        try {
            localStorage.setItem('blogInteractions', JSON.stringify(interactions));
        } catch (error) {
            console.error('Error saving blog interactions to localStorage:', error);
        }
    },

    /**
     * Xóa tất cả interactions từ localStorage
     */
    clearBlogInteractionsFromStorage: (): void => {
        try {
            localStorage.removeItem('blogInteractions');
        } catch (error) {
            console.error('Error clearing blog interactions from localStorage:', error);
        }
    },

    /**
     * Lấy thống kê tương tác từ localStorage
     */
    getInteractionStats: (): {
        totalBlogs: number;
        totalLikes: number;
        totalComments: number;
        blogsWithInteractions: string[];
    } => {
        try {
            const interactions = blogService.getBlogInteractionsFromStorage();
            const stats = {
                totalBlogs: Object.keys(interactions).length,
                totalLikes: 0,
                totalComments: 0,
                blogsWithInteractions: Object.keys(interactions),
            };

            Object.values(interactions).forEach((interaction: any) => {
                stats.totalLikes += interaction.likeCount || 0;
                stats.totalComments += interaction.commentCount || 0;
            });

            return stats;
        } catch (error) {
            console.error('Error getting interaction stats:', error);
            return {
                totalBlogs: 0,
                totalLikes: 0,
                totalComments: 0,
                blogsWithInteractions: [],
            };
        }
    },

    /**
     * Export dữ liệu tương tác để backup
     */
    exportInteractions: (): string => {
        try {
            const interactions = blogService.getBlogInteractionsFromStorage();
            const exportData = {
                exportDate: new Date().toISOString(),
                version: '1.0',
                interactions,
            };
            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('Error exporting interactions:', error);
            return '{}';
        }
    },

    /**
     * Import dữ liệu tương tác từ backup
     */
    importInteractions: (jsonData: string): boolean => {
        try {
            const importData = JSON.parse(jsonData);
            if (importData.interactions) {
                blogService.saveBlogInteractionsToStorage(importData.interactions);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing interactions:', error);
            return false;
        }
    },
};

export default blogService;