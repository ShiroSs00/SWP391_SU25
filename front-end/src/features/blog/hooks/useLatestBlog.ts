import { useState, useEffect, useCallback} from "react";
import { blogService } from "../services/blog.service";
import type { BlogPost } from "../types/blog.types";


interface UseLatestBlogsReturn {
    blogs: BlogPost[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useLatestBlogs = (limit: number = 6): UseLatestBlogsReturn => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLatestBlogs = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const latestBlogs = await blogService.getLatestBlogs(limit);
            setBlogs(Array.isArray(latestBlogs) ? latestBlogs : [latestBlogs]);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải bài viết mới nhất';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchLatestBlogs();
    }, [fetchLatestBlogs]);

    return {
        blogs,
        isLoading,
        error,
        refetch: fetchLatestBlogs
    };
};