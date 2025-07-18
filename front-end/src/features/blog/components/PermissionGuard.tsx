import React from 'react';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/blog.types';

interface PermissionGuardProps {
    requiredRole?: UserRole;
    requiredPermission?: 'createPost' | 'editPost' | 'deletePost' | 'comment' | 'like';
    postAuthorId?: string;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    requiredRole,
    requiredPermission,
    postAuthorId,
    fallback = null,
    children
}) => {
    const { user, hasPermission, canCreatePost, canEditPost, canDeletePost, canComment, canLike } = useAuth();

    // Check role-based permission
    if (requiredRole && !hasPermission(requiredRole)) {
        return <>{fallback}</>;
    }

    // Check specific permission
    if (requiredPermission) {
        let hasAccess = false;

        switch (requiredPermission) {
            case 'createPost':
                hasAccess = canCreatePost();
                break;
            case 'editPost':
                hasAccess = canEditPost(postAuthorId);
                break;
            case 'deletePost':
                hasAccess = canDeletePost(postAuthorId);
                break;
            case 'comment':
                hasAccess = canComment();
                break;
            case 'like':
                hasAccess = canLike();
                break;
            default:
                hasAccess = false;
        }

        if (!hasAccess) {
            return <>{fallback}</>;
        }
    }

    return <>{children}</>;
};