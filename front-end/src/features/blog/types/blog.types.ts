export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  category: BlogCategory;
  tags: string[];
  status: BlogStatus;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  commentsCount: number;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
}

export type BlogCategory = 
  | 'blood_education'
  | 'donation_tips'
  | 'health_wellness'
  | 'success_stories'
  | 'medical_research'
  | 'community'
  | 'news'
  | 'events';

export type BlogStatus = 'draft' | 'published' | 'archived' | 'scheduled';

export interface BlogComment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    isVerified: boolean;
  };
  content: string;
  parentId?: string;
  replies?: BlogComment[];
  likes: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
  isApproved: boolean;
}

export interface BlogFilters {
  category?: BlogCategory;
  tags?: string[];
  author?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: BlogStatus;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
}

export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  totalLikes: number;
  popularPosts: BlogPost[];
  recentPosts: BlogPost[];
  categoryStats: {
    [key in BlogCategory]: number;
  };
  monthlyStats: {
    month: string;
    posts: number;
    views: number;
  }[];
}

export interface BlogForm {
  title: string;
  content: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  featuredImage?: string;
  status: BlogStatus;
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
}