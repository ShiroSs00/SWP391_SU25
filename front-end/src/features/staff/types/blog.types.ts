// Types cho tạo blog mới
export interface CreateBlogRequest {
    blogId: string | null;
    content: string;
    postDate: string;
    tagName: string;
    img: string | null;
    accountId: string | null;
    thumbnail: string | null;
}

// Types cho cập nhật blog
export interface UpdateBlogRequest {
    blogId: string;
    content?: string;
    postDate?: string;
    tagName?: string;
    img?: string | null;
    thumbnail?: string | null;
}

// Blog entity dựa trên API response
export interface Blog {
    blogId: string;
    content: string;
    postDate: string;
    tagName: string;
    img: string | null;
    accountId: string;
    thumbnail: string | null;
    createdAt?: string;
    updatedAt?: string;
    account?: {
        accountId: string;
        name: string;
        email: string;
    };
}

// Response từ API getall - đây là structure thực tế
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors?: {
        additionalProp1?: string;
        additionalProp2?: string;
        additionalProp3?: string;
    };
}

// Response khi tạo blog
export interface CreateBlogResponse {
    blogId: string;
    content: string;
    postDate: string;
    tagName: string;
    img: string;
    accountId: string;
    thumbnail: string;
    createdAt?: string;
}

// Response cho danh sách blogs - API trả về array trực tiếp
export interface BlogListResponse {
    blogs: Blog[];
    total?: number;
    page?: number;
    limit?: number;
}

// Request parameters cho get blogs
export interface GetBlogsParams {
    page?: number;
    limit?: number;
    tagName?: string;
    accountId?: string;
}

// Delete blog response
export interface DeleteBlogResponse {
    message: string;
    success: boolean;
}
