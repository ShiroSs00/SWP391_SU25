import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Bell, Shield, User, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "../ui/Button";
// import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
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

export interface HeaderProps {
    onMenuClick?: () => void
    showMenuButton?: boolean
    className?: string
}

function getUserFromLocalStorage() {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, showMenuButton = false, className }) => {
    const {  logout } = useAuth();
    const navigate = useNavigate();
    const user = getUserFromLocalStorage();

    const handleLogout = async () => {
        await logout();
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
                "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                className,
            )}
        >
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Left side */}
                <div className="flex items-center space-x-4">
                    {showMenuButton && (
                        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}

                    <Link to="/" className="flex items-center space-x-2">
                        <Heart className="h-6 w-6 text-red-600" />
                        <span className="font-bold text-xl text-[#222222]">BloodDonation</span>
                    </Link>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                            <div className="flex items-center space-x-1 mt-1">
                                                <Shield className="h-3 w-3" />
                                                <span className={cn("text-xs font-medium", getRoleColor(user.role))}>
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem asChild>
                                        <Link to="/profile" className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Hồ sơ cá nhân</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link to="/dashboard" className="cursor-pointer">
                                            <Heart className="mr-2 h-4 w-4" />
                                            <span>Bảng điều khiển</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link to="/settings" className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Cài đặt</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Đăng xuất</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link to="/login">
                                <Button variant="ghost">Đăng nhập</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Đăng ký</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export { Header };