import type {
    LocalBlogState,
    BlogPost,
    BlogComment,
    BlogFilters,
    BlogStats,
    BlogForm,
} from '../types/blog.types';
import api from '../../../services/axios/api';

class BlogService {
    private baseUrl = '/api/blog';
    private localState: LocalBlogState = {
        postLikes: {},
        commentLikes: {},
        localComments: {},
    };

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

    private handleApiError(error: unknown): Error {
        if (typeof error === 'object' && error !== null && 'response' in error) {
            // @ts-expect-error: dynamic error shape
            return new Error((error.response?.data?.message || 'API request failed'));
        }
        return new Error('API request failed');
    }

    async getPosts(
        page = 1,
        limit = 10,
        filters?: BlogFilters,
    ): Promise<{ posts: BlogPost[]; total: number; totalPages: number }> {
        try {
            const params = { page: page.toString(), limit: limit.toString(), ...filters };
            const response = await api.get(`${this.baseUrl}/getall`, { params });

            const posts = response.data.posts.map((post: BlogPost) => ({
                ...post,
                likes: this.localState.postLikes[post.id]?.count ?? post.likes,
                commentsCount: post.commentsCount + (this.localState.localComments[post.id]?.length || 0),
            }));

            return {
                ...response.data,
                posts,
            };
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    async getPostBySlug(slug: string): Promise<BlogPost> {
        try {
            const response = await api.get(`${this.baseUrl}/getbyid/slug/${slug}`);
            const post = response.data;

            return {
                ...post,
                likes: this.localState.postLikes[post.id]?.count ?? post.likes,
                commentsCount: post.commentsCount + (this.localState.localComments[post.id]?.length || 0),
            };
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    async getPostById(id: string): Promise<BlogPost> {
        try {
            const response = await api.get(`${this.baseUrl}/getbyid/${id}`);
            const post = response.data;

            return {
                ...post,
                likes: this.localState.postLikes[post.id]?.count ?? post.likes,
                commentsCount: post.commentsCount + (this.localState.localComments[post.id]?.length || 0),
            };
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    async createPost(post: BlogForm): Promise<BlogPost> {
        try {
            const response = await api.post(`${this.baseUrl}/create`, {
                content: post.content,
                postDate: post.publishedAt ? post.publishedAt.toISOString() : new Date().toISOString(),
                component: post.category,
                tagname: post.tags.join(','),
                accountId: localStorage.getItem('userId') || '',
            });
            return response.data;
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    async updatePost(id: string, post: Partial<BlogForm>): Promise<BlogPost> {
        try {
            const response = await api.put(`${this.baseUrl}/update/${id}`, {
                content: post.content,
                postDate: post.publishedAt ? post.publishedAt.toISOString() : new Date().toISOString(),
                component: post.category,
                tagname: post.tags?.join(','),
                accountId: localStorage.getItem('userId') || '',
            });
            return response.data;
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    async deletePost(id: string): Promise<void> {
        try {
            await api.delete(`${this.baseUrl}/delete/${id}`);

            delete this.localState.postLikes[id];
            delete this.localState.localComments[id];
            this.saveLocalState();
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    async deleteMultiple(ids: string[]): Promise<void> {
        try {
            await api.delete(`${this.baseUrl}/delete-multiple`, { data: { ids } });

            // Cleanup local state for all deleted posts
            ids.forEach(id => {
                delete this.localState.postLikes[id];
                delete this.localState.localComments[id];
            });
            this.saveLocalState();
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    async likePost(id: string): Promise<{ likes: number; isLiked: boolean }> {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            const currentState = this.localState.postLikes[id];
            if (!currentState) {
                const post = await this.getPostById(id);
                this.localState.postLikes[id] = {
                    count: (typeof post.likes === 'number' ? post.likes : 0) + 1,
                    isLiked: true,
                };
            } else {
                const newCount = currentState.isLiked ? Math.max(0, currentState.count - 1) : currentState.count + 1;
                this.localState.postLikes[id] = {
                    count: newCount,
                    isLiked: !currentState.isLiked,
                };
            }

            this.saveLocalState();
            return {
                likes: this.localState.postLikes[id].count,
                isLiked: this.localState.postLikes[id].isLiked,
            };
        } catch (error) {
            console.error('Error in likePost:', error);
            throw new Error('Failed to like post');
        }
    }

    isPostLiked(postId: string): boolean {
        return this.localState.postLikes[postId]?.isLiked || false;
    }

    async getComments(
        postId: string,
        page = 1,
        limit = 10,
    ): Promise<{ comments: BlogComment[]; total: number; totalPages: number }> {
        try {
            const response = await api.get(`${this.baseUrl}/${postId}/comments`, { params: { page, limit } });

            const serverComments = response.data.comments || [];
            const localComments = this.localState.localComments[postId] || [];

            const allComments = [...serverComments, ...localComments].map(comment => ({
                ...comment,
                likes: this.localState.commentLikes[comment.id]?.count ?? comment.likes,
                isLiked: this.localState.commentLikes[comment.id]?.isLiked ?? false,
            }));

            const total = response.data.total + localComments.length;
            const totalPages = Math.ceil(total / limit);

            return { comments: allComments, total, totalPages };
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    async addComment(postId: string, content: string, parentId?: string): Promise<BlogComment> {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const userId = localStorage.getItem('userId') || 'anonymous';
            const userName = localStorage.getItem('userName') || 'Anonymous User';

            const newComment: BlogComment = {
                id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                postId,
                author: { id: userId, name: userName, isVerified: false },
                content,
                parentId,
                likes: 0,
                isLiked: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                isApproved: true,
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

    async likeComment(commentId: string): Promise<{ likes: number; isLiked: boolean }> {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            const currentState = this.localState.commentLikes[commentId];
            if (!currentState) {
                this.localState.commentLikes[commentId] = { count: 1, isLiked: true };
            } else {
                this.localState.commentLikes[commentId] = {
                    count: currentState.isLiked ? currentState.count - 1 : currentState.count + 1,
                    isLiked: !currentState.isLiked,
                };
            }

            this.saveLocalState();
            const { count, isLiked } = this.localState.commentLikes[commentId];
            return { likes: count, isLiked };
        } catch (error) {
            console.error('Error in likeComment:', error);
            throw new Error('Failed to like comment');
        }
    }

    isCommentLiked(commentId: string): boolean {
        return this.localState.commentLikes[commentId]?.isLiked || false;
    }

    async getBlogStats(): Promise<BlogStats> {
        try {
            const response = await api.get(`${this.baseUrl}/stats`);
            return response.data;
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    async getFeaturedPosts(): Promise<BlogPost[]> {
        try {
            const response = await api.get(`${this.baseUrl}/featured`);
            const posts = response.data;

            return posts.map((post: BlogPost) => ({
                ...post,
                likes: this.localState.postLikes[post.id]?.count ?? post.likes,
                commentsCount: post.commentsCount + (this.localState.localComments[post.id]?.length || 0),
            }));
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    async getRelatedPosts(postId: string): Promise<BlogPost[]> {
        try {
            const response = await api.get(`${this.baseUrl}/${postId}/related`);
            const posts = response.data;

            return posts.map((post: BlogPost) => ({
                ...post,
                likes: this.localState.postLikes[post.id]?.count ?? post.likes,
                commentsCount: post.commentsCount + (this.localState.localComments[post.id]?.length || 0),
            }));
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    clearLocalState(): void {
        this.localState = { postLikes: {}, commentLikes: {}, localComments: {} };
        localStorage.removeItem('blogLocalState');
    }

    getLocalState(): LocalBlogState {
        return { ...this.localState };
    }

    async syncLocalDataToServer(): Promise<void> {
        console.log('Sync to server - not implemented yet');
    }
}

export const blogService = new BlogService();