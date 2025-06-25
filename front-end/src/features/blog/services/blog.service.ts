import type { LocalBlogState, BlogPost, BlogComment, BlogFilters, BlogStats, BlogForm } from '../types/blog.types';
import api from '../../../services/axios/api';


class BlogService {
    private baseUrl = '/blog';

    // Local state để lưu trữ likes và comments tạm thời
    private localState: LocalBlogState = {
        postLikes: {},
        commentLikes: {},
        localComments: {}
    };

    // Load local state từ localStorage khi khởi tạo
    constructor() {
        this.loadLocalState();
    }

    private loadLocalState(): void {
        try {
            const saved = localStorage.getItem('blogLocalState');
            if (saved) {
                this.localState = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load local blog state:', error);
        }
    }

    private saveLocalState(): void {
        try {
            localStorage.setItem('blogLocalState', JSON.stringify(this.localState));
        } catch (error) {
            console.warn('Failed to save local blog state:', error);
        }
    }

    async getPosts(page = 1, limit = 10, filters?: BlogFilters): Promise<{
        posts: BlogPost[];
        total: number;
        totalPages: number;
    }> {
        try {
            const params = { page: page.toString(), limit: limit.toString(), ...filters };
            const response = await api.get('/posts', { params });

            // Apply local state to posts
            const posts = response.data.posts.map((post: BlogPost) => ({
                ...post,
                likes: this.localState.postLikes[post.id]?.count ?? post.likes,
                commentsCount: post.commentsCount + (this.localState.localComments[post.id]?.length || 0)
            }));

            return {
                ...response.data,
                posts
            };
        } catch (error) {
            throw new Error((error as any)?.response?.data?.message || 'Failed to fetch blog posts');
        }
    }

    async getPostBySlug(slug: string): Promise<BlogPost> {
        try {
            const response = await api.get(`/posts/slug/${slug}`);
            const post = response.data;

            // Apply local state
            return {
                ...post,
                likes: this.localState.postLikes[post.id]?.count ?? post.likes,
                commentsCount: post.commentsCount + (this.localState.localComments[post.id]?.length || 0)
            };
        } catch (error) {
            throw new Error((error as any)?.response?.data?.message || 'Failed to fetch blog post');
        }
    }

    async getPostById(id: string): Promise<BlogPost> {
        try {
            const response = await api.get(`/posts/${id}`);
            const post = response.data;

            // Apply local state
            return {
                ...post,
                likes: this.localState.postLikes[post.id]?.count ?? post.likes,
                commentsCount: post.commentsCount + (this.localState.localComments[post.id]?.length || 0)
            };
        } catch (error) {
            throw new Error((error as any)?.response?.data?.message || 'Failed to fetch blog post');
        }
    }

    async createPost(post: BlogForm): Promise<BlogPost> {
        try {
            const response = await api.post('/create', {
                content: post.content,
                postDate: post.publishedAt ? post.publishedAt.toISOString() : new Date().toISOString(),
                component: post.category,
                tagname: post.tags.join(','),
                accountId: localStorage.getItem('userId') || '',
            });
            return response.data;
        } catch (error) {
            throw new Error((error as any)?.response?.data?.message || 'Failed to create blog post');
        }
    }

    async updatePost(id: string, post: Partial<BlogForm>): Promise<BlogPost> {
        try {
            const response = await api.put(`/update/${id}`, {
                content: post.content,
                postDate: post.publishedAt ? post.publishedAt.toISOString() : new Date().toISOString(),
                component: post.category,
                tagname: post.tags?.join(','),
                accountId: localStorage.getItem('userId') || '',
            });
            return response.data;
        } catch (error) {
            throw new Error((error as any)?.response?.data?.message || 'Failed to update blog post');
        }
    }

    async deletePost(id: string): Promise<void> {
        try {
            await api.delete(`/posts/${id}`);

            // Cleanup local state khi xóa post
            delete this.localState.postLikes[id];
            delete this.localState.localComments[id];
            this.saveLocalState();
        } catch (error) {
            throw new Error((error as any)?.response?.data?.message || 'Failed to delete blog post');
        }
    }

    // Like post - chỉ lưu local, không gọi API
    async likePost(id: string): Promise<{ likes: number; isLiked: boolean }> {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const currentState = this.localState.postLikes[id];
            // Trong likePost
            if (!currentState) {
                // Lần đầu like - cần lấy số like hiện tại từ server hoặc state
                const post = await this.getPostById(id);
                this.localState.postLikes[id] = {
                    count: (typeof post.likes === 'number' ? post.likes : 0) + 1,
                    isLiked: true
                };
            } else {
                // Toggle like/unlike, đảm bảo count không âm
                const newCount = currentState.isLiked
                    ? Math.max(0, currentState.count - 1)
                    : currentState.count + 1;
                this.localState.postLikes[id] = {
                    count: newCount,
                    isLiked: !currentState.isLiked
                };
            }

            this.saveLocalState();
            return {
                likes: this.localState.postLikes[id].count,
                isLiked: this.localState.postLikes[id].isLiked
            };
        } catch (error) {
            console.error('Error in likePost:', error);
            throw new Error('Failed to like post');
        }
    }

    // Check if post is liked
    isPostLiked(postId: string): boolean {
        return this.localState.postLikes[postId]?.isLiked || false;
    }

    async getComments(postId: string, page = 1, limit = 10): Promise<{
        comments: BlogComment[];
        total: number;
        totalPages: number;
    }> {
        try {
            const response = await api.get(`/posts/${postId}/comments`, { params: { page, limit } });

            // Merge với local comments
            const serverComments = response.data.comments || [];
            const localComments = this.localState.localComments[postId] || [];

            // Apply local like state to comments
            const allComments = [...serverComments, ...localComments].map(comment => ({
                ...comment,
                likes: this.localState.commentLikes[comment.id]?.count ?? comment.likes,
                isLiked: this.localState.commentLikes[comment.id]?.isLiked ?? false
            }));

            const total = response.data.total + localComments.length;
            const totalPages = Math.ceil(total / limit);

            return {
                comments: allComments,
                total,
                totalPages
            };
        } catch (error) {
            throw new Error((error as any)?.response?.data?.message || 'Failed to fetch comments');
        }
    }

    // Add comment - chỉ lưu local
    async addComment(postId: string, content: string, parentId?: string): Promise<BlogComment> {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const userId = localStorage.getItem('userId') || 'anonymous';
            const userName = localStorage.getItem('userName') || 'Anonymous User';

            const newComment: BlogComment = {
                id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                postId,
                author: {
                    id: userId,
                    name: userName,
                    isVerified: false
                },
                content,
                parentId,
                likes: 0,
                isLiked: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                isApproved: true
            };

            if (!this.localState.localComments[postId]) {
                this.localState.localComments[postId] = [];
            }

            this.localState.localComments[postId].push(newComment);
            this.saveLocalState();

            return newComment;
        } catch (error) {
            console.error('Error in addComment:', error);
            throw new Error('Failed to add comment');
        }
    }

    // Like comment - chỉ lưu local
    async likeComment(commentId: string): Promise<{ likes: number; isLiked: boolean }> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const currentState = this.localState.commentLikes[commentId];

        if (!currentState) {
            // Lần đầu like
            this.localState.commentLikes[commentId] = {
                count: 1,
                isLiked: true
            };
        } else {
            // Toggle like/unlike
            this.localState.commentLikes[commentId] = {
                count: currentState.isLiked ? currentState.count - 1 : currentState.count + 1,
                isLiked: !currentState.isLiked
            };
        }

        this.saveLocalState();
        const { count, isLiked } = this.localState.commentLikes[commentId];
        return { likes: count, isLiked };
    }

    // Check if comment is liked
    isCommentLiked(commentId: string): boolean {
        return this.localState.commentLikes[commentId]?.isLiked || false;
    }

    async getBlogStats(): Promise<BlogStats> {
        try {
            const response = await api.get('/stats');
            return response.data;
        } catch (error) {
            throw new Error((error as any)?.response?.data?.message || 'Failed to fetch blog stats');
        }
    }

    async getFeaturedPosts(): Promise<BlogPost[]> {
        try {
            const response = await api.get('/posts/featured');
            const posts = response.data;

            // Apply local state
            return posts.map((post: BlogPost) => ({
                ...post,
                likes: this.localState.postLikes[post.id]?.count ?? post.likes,
                commentsCount: post.commentsCount + (this.localState.localComments[post.id]?.length || 0)
            }));
        } catch (error) {
            throw new Error((error as any)?.response?.data?.message || 'Failed to fetch featured posts');
        }
    }

    async getRelatedPosts(postId: string): Promise<BlogPost[]> {
        try {
            const response = await api.get(`/posts/${postId}/related`);
            const posts = response.data;

            // Apply local state
            return posts.map((post: BlogPost) => ({
                ...post,
                likes: this.localState.postLikes[post.id]?.count ?? post.likes,
                commentsCount: post.commentsCount + (this.localState.localComments[post.id]?.length || 0)
            }));
        } catch (error) {
            throw new Error((error as any)?.response?.data?.message || 'Failed to fetch related posts');
        }
    }

    // Utility methods để quản lý local state
    clearLocalState(): void {
        this.localState = {
            postLikes: {},
            commentLikes: {},
            localComments: {}
        };
        localStorage.removeItem('blogLocalState');
    }

    getLocalState(): LocalBlogState {
        return { ...this.localState };
    }

    // Method để sync local data với server (nếu cần trong tương lai)
    async syncLocalDataToServer(): Promise<void> {
        // Implementation để đồng bộ dữ liệu local lên server
        // Có thể implement sau khi có API hỗ trợ
        console.log('Sync to server - not implemented yet');
    }
}

export const blogService = new BlogService();