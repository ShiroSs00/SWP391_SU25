import { useState, useEffect } from "react"
import type { User, UserRole } from "../types/blog.types"

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    })

    useEffect(() => {
        const initAuth = () => {
            try {
                const token = localStorage.getItem("authToken")
                const userStr = localStorage.getItem("user") // Changed from 'userData' to 'user'

                if (token && userStr) {
                    const userData = JSON.parse(userStr)

                    // Map your existing user data to blog user format
                    const user: User = {
                        id: userData.id || "1",
                        name: userData.name || userData.username || "Unknown User",
                        email: userData.email || "",
                        avatar:
                            userData.avatar ||
                            userData.profilePicture ||
                            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
                        role: userData.role || "GUEST", // This should be 'ADMIN', 'STAFF', etc.
                    }

                    setAuthState({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                    })
                } else {
                    setAuthState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    })
                }
            } catch (error) {
                console.error("Auth initialization error:", error)
                setAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
            }
        }

        initAuth()
    }, [])

    const login = (user: User, token: string) => {
        localStorage.setItem("authToken", token)
        localStorage.setItem("user", JSON.stringify(user))
        setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
        })
    }

    const logout = () => {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        })
    }

    const hasPermission = (requiredRole: UserRole): boolean => {
        if (!authState.user) return false

        const roleHierarchy: Record<UserRole, number> = {
            MEMBER: 1,
            STAFF: 2,
            ADMIN: 3,
        }

        return roleHierarchy[authState.user.role] >= roleHierarchy[requiredRole]
    }

    const canCreatePost = (): boolean => {
        return hasPermission("STAFF")
    }

    const canEditPost = (postAuthorId?: string): boolean => {
        if (!authState.user) return false
        if (hasPermission("ADMIN")) return true
        if (hasPermission("STAFF") && postAuthorId === authState.user.id) return true
        return false
    }

    const canDeletePost = (postAuthorId?: string): boolean => {
        return canEditPost(postAuthorId)
    }

    const canComment = (): boolean => {
        return hasPermission("MEMBER")
    }

    const canLike = (): boolean => {
        return hasPermission("MEMBER")
    }

    return {
        ...authState,
        login,
        logout,
        hasPermission,
        canCreatePost,
        canEditPost,
        canDeletePost,
        canComment,
        canLike,
    }
}