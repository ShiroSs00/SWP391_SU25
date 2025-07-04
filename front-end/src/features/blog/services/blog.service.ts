
import api from '../../../services/axios/api';
import  type{ BlogPost, CreateBlogRequest, UpdateBlogRequest } from '../types/blog.types';




export const blogService = {
    // Get all blog posts
    getAllBlogs: async (): Promise<BlogPost[]> => {
        try {
            const response = await api.get('/blog/get_all')
            return response.data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
            throw new Error('Không thể tải danh sách bài viết');
        }
    },

    // Get blog by ID
    getBlogById: async (id: string): Promise<BlogPost> => {
        try {
            const response = await api.get(`/blog/get_by_id/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching blog:', error);
            throw new Error('Không thể tải bài viết');
        }
    },

    // Get blog by ID
    getLatestBlogs: async (limit: number= 0): Promise<BlogPost> => {
        try {
            const response = await api.get(`/blog/latest/limit/${limit}`);
            return response.data;
            return Array.isArray(response.data) ? response.data : [response.data];
        } catch (error) {
            console.error('Error fetching blog:', error);
            throw new Error('Không thể tải bài viết mới nhất');
        }
    },

    // Create new blog post (Staff only)
    createBlog: async (blogData: CreateBlogRequest): Promise<BlogPost> => {
        try {
            const response = await api.post('/blog/create', blogData);
            return response.data;
        } catch (error) {
            console.error('Error creating blog:', error);
            throw new Error('Không thể tạo bài viết mới');
        }
    },

    // Update blog post (Staff only)
    updateBlog: async (id: string, blogData: UpdateBlogRequest): Promise<BlogPost> => {
        try {
            const response = await api.put(`/blog/update/${id}`, blogData);
            return response.data;
        } catch (error) {
            console.error('Error updating blog:', error);
            throw new Error('Không thể cập nhật bài viết');
        }
    },

    // Delete single blog post (Staff only)
    deleteBlog: async (id: string): Promise<void> => {
        try {
            await api.delete(`/blog/delete/${id}`);
        } catch (error) {
            console.error('Error deleting blog:', error);
            throw new Error('Không thể xóa bài viết');
        }
    },

    // Delete multiple blog posts (Staff only)
    deleteMultipleBlogs: async (ids: string[]): Promise<void> => {
        try {
            await api.delete('/blog/delete_multiple', { data: { ids } });
        } catch (error) {
            console.error('Error deleting multiple blogs:', error);
            throw new Error('Không thể xóa nhiều bài viết');
        }
    },
};

export default api;