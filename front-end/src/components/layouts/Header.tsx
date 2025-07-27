import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Shield, User, Settings, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu/dropdown-menu";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { cn } from "../../lib/utils";
import { getUserFromLocalStorage, triggerUserStateChange } from "../../lib/userUtils";

export interface HeaderProps {
    onMenuClick?: () => void
    showMenuButton?: boolean
    className?: string
}

// Custom hook to track user state changes
function useUserState() {
    const [user, setUser] = useState(getUserFromLocalStorage);

    useEffect(() => {
        const updateUserState = () => {
            setUser(getUserFromLocalStorage());
        };

        window.addEventListener('storage', updateUserState);
        window.addEventListener('userStateChange', updateUserState);

        return () => {
            window.removeEventListener('storage', updateUserState);
            window.removeEventListener('userStateChange', updateUserState);
        };
    }, []);

    return user;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, showMenuButton = false, className }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useUserState();


    // Menu items
    const menuItems = [
        { name: 'Trang Chủ', href: '/' },
        { name: 'Blog', href: '/blogs' },
        { name: 'Nhóm Máu', href: '/blood-types' },
        { name: 'Yêu Cầu Máu', href: '/request-blood' },
        { name: 'Hiến Máu', href: '/donation' },
        { name: 'Sự kiện', href: '/events' },
        { name: 'Cấp Cứu', href: '/emergency' },
        { name: 'Giới Thiệu', href: '/about' },
        { name: 'Liên Hệ', href: '/contact' }
    ];

    const handleLogout = async () => {
        await logout();
        triggerUserStateChange();
        navigate("/");
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "text-red-600 bg-red-50";
            case "staff":
                return "text-blue-600 bg-blue-50";
            case "member":
                return "text-green-600 bg-green-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    const getUserInitials = (name: string = "") => {
        return name
            .split(" ")
            .map((n) => n?.charAt(0) || "")
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const isActivePath = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 shadow-sm",
                className,
            )}
        >
            <div className="w-full max-w-none px-6">
                <div className="flex h-16 items-center w-full">
                    {/* Left side - Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-200">
                                <Heart className="h-6 w-6 text-red-600" />
                            </div>
                            <span className="font-bold text-xl text-gray-800 group-hover:text-red-600 transition-colors duration-200" style={{ fontFamily: 'Inter, sans-serif' }}>
                                BloodCare
                            </span>
                        </Link>
                    </div>

                    {/* Center - Navigation */}
                    <nav className="flex items-center space-x-1 flex-1 justify-center">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 relative",
                                    isActivePath(item.href)
                                        ? "text-red-600 bg-red-50 font-semibold"
                                        : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                                )}
                            >
                                {item.name}
                                {isActivePath(item.href) && (
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-red-600 rounded-full"></div>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side - Auth buttons & User menu */}
                    <div className="flex items-center space-x-3 flex-shrink-0">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                {/* Welcome message */}
                                <div className="text-sm text-gray-600">
                                    Chào, <span className="font-semibold text-gray-800">{user.name}</span>
                                </div>

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="relative h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md"
                                            title={user.name}
                                        >
                                            <span className="text-sm font-semibold">{getUserInitials(user.name)}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white shadow-md">
                                                    <span className="text-sm font-semibold">{getUserInitials(user.name)}</span>
                                                </div>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                    <div className="flex items-center space-x-1 mt-1">
                                                        <Shield className="h-3 w-3" />
                                                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", getRoleColor(user.role))}>
                                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem asChild className="py-2 px-4 hover:bg-blue-50 focus:bg-blue-50">
                                            <Link to="/member/profile" className="cursor-pointer flex items-center">
                                                <User className="mr-3 h-4 w-4 text-blue-600" />
                                                <span className="text-sm">Hồ sơ cá nhân</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild className="py-2 px-4 hover:bg-green-50 focus:bg-green-50">
                                            <Link to="/member/dashboard" className="cursor-pointer flex items-center">
                                                <Heart className="mr-3 h-4 w-4 text-green-600" />
                                                <span className="text-sm">Bảng điều khiển</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild className="py-2 px-4 hover:bg-purple-50 focus:bg-purple-50">
                                            <Link to="/member/settings" className="cursor-pointer flex items-center">
                                                <Settings className="mr-3 h-4 w-4 text-purple-600" />
                                                <span className="text-sm">Cài đặt</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem className="py-2 px-4 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700" onClick={handleLogout}>
                                            <LogOut className="mr-3 h-4 w-4" />
                                            <span className="text-sm">Đăng xuất</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-700 hover:text-red-600 hover:bg-red-50 font-medium transition-all duration-200"
                                    >
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        Đăng ký
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export { Header };