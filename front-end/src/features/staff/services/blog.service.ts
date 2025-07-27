import api from '../../../services/axios/api';
import type { 
    CreateBlogRequest, 
    CreateBlogResponse,
    UpdateBlogRequest,
    Blog,
    BlogListResponse,
    GetBlogsParams,
    DeleteBlogResponse,
    ApiResponse
} from '../types/blog.types';

export const blogService = {
    // Tạo blog mới
    createBlog: async (blogData: CreateBlogRequest | FormData): Promise<CreateBlogResponse> => {
        try {
            console.log('Sending blog data to API:', blogData);
            
            // Nếu là FormData, gửi với Content-Type: multipart/form-data
            // Nếu là CreateBlogRequest, gửi với Content-Type: application/json
            const config = blogData instanceof FormData ? {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            } : {};
            
            const response = await api.post<ApiResponse<CreateBlogResponse>>('/blog/create', blogData, config);
            console.log('API response:', response.data);
            return response.data.data;
        } catch (error: unknown) {
            console.error('Error creating blog:', error);
            const apiError = error as { response?: { data?: { message?: string } } };
            console.error('Error details:', apiError.response?.data);
            const message = apiError.response?.data?.message || 'Không thể tạo bài viết mới';
            throw new Error(message);
        }
    },

    // Lấy danh sách blogs
    getBlogs: async (params?: GetBlogsParams): Promise<BlogListResponse> => {
        try {
            const queryParams = new URLSearchParams();
            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());
            if (params?.tagName) queryParams.append('tagName', params.tagName);
            if (params?.accountId) queryParams.append('accountId', params.accountId);

            const url = `/blog/getall${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await api.get<ApiResponse<Blog[]>>(url);
            
            // API trả về array trực tiếp trong data, không có pagination info
            return {
                blogs: response.data.data,
                total: response.data.data.length,
                page: params?.page || 1,
                limit: params?.limit || 10
            };
        } catch (error: unknown) {
            console.error('Error fetching blogs:', error);
            const apiError = error as { response?: { data?: { message?: string } } };
            const message = apiError.response?.data?.message || 'Không thể lấy danh sách bài viết';
            throw new Error(message);
        }
    },

    // Lấy blog theo ID
    getBlogById: async (blogId: string): Promise<Blog> => {
        try {
            const response = await api.get<ApiResponse<Blog>>(`/blog/getbyid/${blogId}`);
            return response.data.data;
        } catch (error: unknown) {
            console.error('Error fetching blog by ID:', error);
            const apiError = error as { response?: { data?: { message?: string } } };
            const message = apiError.response?.data?.message || 'Không thể lấy thông tin bài viết';
            throw new Error(message);
        }
    },

    // Cập nhật blog
    updateBlog: async (blogId: string, blogData: UpdateBlogRequest): Promise<Blog> => {
        try {
            const response = await api.put<ApiResponse<Blog>>(`/blog/update/${blogId}`, blogData);
            return response.data.data;
        } catch (error: unknown) {
            console.error('Error updating blog:', error);
            const apiError = error as { response?: { data?: { message?: string } } };
            const message = apiError.response?.data?.message || 'Không thể cập nhật bài viết';
            throw new Error(message);
        }
    },

    // Xóa blog
    deleteBlog: async (blogId: string): Promise<DeleteBlogResponse> => {
        try {
            const response = await api.delete<ApiResponse<DeleteBlogResponse>>(`/blog/delete/${blogId}`);
            return response.data.data;
        } catch (error: unknown) {
            console.error('Error deleting blog:', error);
            const apiError = error as { response?: { data?: { message?: string } } };
            const message = apiError.response?.data?.message || 'Không thể xóa bài viết';
            throw new Error(message);
        }
    },

    // Xóa nhiều blogs
    deleteMultipleBlogs: async (blogIds: string[]): Promise<DeleteBlogResponse> => {
        try {
            const response = await api.delete<ApiResponse<DeleteBlogResponse>>('/blog/delete-multiple', {
                data: { blogIds }
            });
            return response.data.data;
        } catch (error: unknown) {
            console.error('Error deleting multiple blogs:', error);
            const apiError = error as { response?: { data?: { message?: string } } };
            const message = apiError.response?.data?.message || 'Không thể xóa các bài viết';
            throw new Error(message);
        }
    }
};

export default blogService;
