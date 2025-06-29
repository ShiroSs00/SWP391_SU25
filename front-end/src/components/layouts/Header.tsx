import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Shield, User, Settings, LogOut, Menu } from "lucide-react";
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
        // Function to update user state when localStorage changes
        const updateUserState = () => {
            setUser(getUserFromLocalStorage());
        };

        // Listen for storage events (when localStorage changes in other tabs)
        window.addEventListener('storage', updateUserState);

        // Custom event for same-tab localStorage changes
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
    const user = useUserState(); // Use the custom hook instead of direct localStorage read

    // Debug logging
    console.log('Header - Current user state:', user);

    const handleLogout = async () => {
        await logout();
        triggerUserStateChange(); // Trigger state update after logout
        navigate("/");
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "text-red-600";
            case "staff":
                return "text-blue-600";
            case "member":
                return "text-green-600";
            default:
                return "text-gray-600";
        }
    };


    const getUserInitials = (name: string = "") => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 shadow-sm",
                className,
            )}
        >
            <div className="container flex h-20 items-center justify-between px-6">
                {/* Left side */}
                <div className="flex items-center space-x-4">
                    {showMenuButton && (
                        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}

                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Heart className="h-7 w-7 text-blue-600" />
                        </div>
                        <span className="font-bold text-2xl text-gray-800 group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                            BloodDonation
                        </span>
                    </Link>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="default"
                                        size="icon"
                                        className="rounded-full bg-blood-500 text-white font-bold uppercase shadow-md border-2 border-white"
                                        title={user.name}
                                    >
                                        {getUserInitials(user.name)}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-72 mr-4" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                                                <span className="text-lg font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>{getUserInitials(user.name)}</span>
                                            </div>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-base font-semibold leading-none text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>{user.name}</p>
                                                <p className="text-sm leading-none text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>{user.email}</p>
                                                <div className="flex items-center space-x-1 mt-2">
                                                    <Shield className="h-4 w-4" />
                                                    <span className={cn("text-sm font-medium px-2 py-1 rounded-full bg-gray-100", getRoleColor(user.role))} style={{ fontFamily: 'Inter, sans-serif' }}>
                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="my-2" />

                                    <DropdownMenuItem asChild className="py-3 px-4 hover:bg-blue-50 focus:bg-blue-50">
                                        <Link to="/profile" className="cursor-pointer flex items-center">
                                            <User className="mr-3 h-5 w-5 text-blue-600" />
                                            <span className="text-base font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Hồ sơ cá nhân</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild className="py-3 px-4 hover:bg-green-50 focus:bg-green-50">
                                        <Link to="/dashboard" className="cursor-pointer flex items-center">
                                            <Heart className="mr-3 h-5 w-5 text-green-600" />
                                            <span className="text-base font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Bảng điều khiển</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild className="py-3 px-4 hover:bg-purple-50 focus:bg-purple-50">
                                        <Link to="/settings" className="cursor-pointer flex items-center">
                                            <Settings className="mr-3 h-5 w-5 text-purple-600" />
                                            <span className="text-base font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Cài đặt</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="my-2" />

                                    <DropdownMenuItem className="py-3 px-4 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700" onClick={handleLogout}>
                                        <LogOut className="mr-3 h-5 w-5" />
                                        <span className="text-base font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Đăng xuất</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link to="/login">
                                <Button variant="outline" className="px-6 py-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Đăng nhập
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Đăng ký
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export { Header };