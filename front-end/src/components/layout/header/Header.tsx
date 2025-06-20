import React from 'react';
import { Bell, User, Settings, LogOut, Heart } from 'lucide-react';

export interface HeaderProps {
    title?: string;
    user?: {
        name: string;
        avatar?: string;
        role: string;
    };
    notifications?: number;
    onNotificationClick?: () => void;
    onProfileClick?: () => void;
    onSettingsClick?: () => void;
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
                                           title = 'Blood Donation Management',
                                           user,
                                           notifications = 0,
                                           onNotificationClick,
                                           onProfileClick,
                                           onSettingsClick,
                                           onLogout
                                       }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Heart className="w-8 h-8 text-red-600" />
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button
                        onClick={onNotificationClick}
                        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <Bell className="w-6 h-6" />
                        {notifications > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications > 9 ? '9+' : notifications}
              </span>
                        )}
                    </button>

                    {/* User Menu */}
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                        <User className="w-5 h-5 text-red-600" />
                                    </div>
                                )}
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                            </button>

                            {isProfileMenuOpen && (
                                <>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                        <button
                                            onClick={() => {
                                                onProfileClick?.();
                                                setIsProfileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                onSettingsClick?.();
                                                setIsProfileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </button>
                                        <hr className="my-1 border-gray-200" />
                                        <button
                                            onClick={() => {
                                                onLogout?.();
                                                setIsProfileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;