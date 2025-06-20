import { BlogPost, BlogComment, BlogFilters, BlogStats, BlogForm } from '../types/blog.types';

class BlogService {
  private baseUrl = '/api/blog';

  async getPosts(page = 1, limit = 10, filters?: BlogFilters): Promise<{
    posts: BlogPost[];
    total: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.author) params.append('author', filters.author);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.status) params.append('status', filters.status);
      if (filters.tags?.length) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start.toISOString());
        params.append('endDate', filters.dateRange.end.toISOString());
      }
    }

    const response = await fetch(`${this.baseUrl}/posts?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    return response.json();
  }

  async getPostBySlug(slug: string): Promise<BlogPost> {
    const response = await fetch(`${this.baseUrl}/posts/slug/${slug}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }

    return response.json();
  }

  async getPostById(id: string): Promise<BlogPost> {
    const response = await fetch(`${this.baseUrl}/posts/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }

    return response.json();
  }

  async createPost(post: BlogForm): Promise<BlogPost> {
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(post)
    });

    if (!response.ok) {
      throw new Error('Failed to create blog post');
    }

    return response.json();
  }

  async updatePost(id: string, post: Partial<BlogForm>): Promise<BlogPost> {
    const response = await fetch(`${this.baseUrl}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(post)
    });

    if (!response.ok) {
      throw new Error('Failed to update blog post');
    }

    return response.json();
  }

  async deletePost(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete blog post');
    }
  }

  async likePost(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/posts/${id}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to like post');
    }
  }

  async getComments(postId: string, page = 1, limit = 10): Promise<{
    comments: BlogComment[];
    total: number;
    totalPages: number;
  }> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}/comments?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    return response.json();
  }

  async addComment(postId: string, content: string, parentId?: string): Promise<BlogComment> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ content, parentId })
    });

    if (!response.ok) {
      throw new Error('Failed to add comment');
    }

    return response.json();
  }

  async likeComment(commentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to like comment');
    }
  }

  async getBlogStats(): Promise<BlogStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blog stats');
    }

    return response.json();
  }

  async getFeaturedPosts(): Promise<BlogPost[]> {
    const response = await fetch(`${this.baseUrl}/posts/featured`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch featured posts');
    }

    return response.json();
  }

  async getRelatedPosts(postId: string): Promise<BlogPost[]> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}/related`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch related posts');
    }

    return response.json();
  }
}

export const blogService = new BlogService();