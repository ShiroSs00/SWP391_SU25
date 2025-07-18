export interface BlogPost {
    blogId: string;
    content: string;
    postDate: string;
    tagName: string;
    img: string;
    accountId: string;
    thumbnail: string;
    title?: string;
    summary?: string;
    author?: {
        id: string;
        name: string;
        avatar?: string;
        role: UserRole;
    };
    createdAt?: string;
    updatedAt?: string;
    isPublished?: boolean;
    viewCount?: number;
    like?: number;
    comment?: number;
}

export interface CreateBlogRequest {
    content: string;
    postDate: string;
    tagName: string;
    img: string;
    accountId: string;
    thumbnail: string;
}

export type UpdateBlogRequest = Partial<CreateBlogRequest>

export interface BlogListResponse {
    blogs: BlogPost[];
    total: number;
    page: number;
    limit: number;
}

export interface BlogComment {
    id: string;
    blogId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
    parentId?: string;
    replies?: BlogComment[];
}

export interface BlogLike {
    id: string;
    blogId: string;
    userId: string;
    createdAt: string;
}

export interface BlogInteraction {
    blogId: string;
    likes: BlogLike[];
    comments: BlogComment[];
    likeCount: number;
    commentCount: number;
}

export type UserRole =  'MEMBER' | 'STAFF' | 'ADMIN';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
}

export interface BlogFilters {
    search?: string;
    tags?: string[];
    author?: string;
    sortBy?: 'createdAt' | 'viewCount' | 'title';
    sortOrder?: 'asc' | 'desc';
}

export const BLOG_TAGS = [
    'Câu chuyện',
    'Kinh nghiệm',
    'Y học',
    'Tin tức',
    'Hướng dẫn',
    'Sự kiện',
    'Thống kê',
    'Nghiên cứu'
] as const;



export type BlogTag = typeof BLOG_TAGS[number];