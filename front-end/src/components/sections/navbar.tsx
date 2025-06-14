import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const menuItems = [
        { label: 'Trang Chủ', path: '/' },
        { label: 'Nhóm Máu', path: '/blood-types' },
        { label: 'Blog', path: '/blogs' },
        { label: 'Q Tìm Kiếm', path: '/need-blood' },
        { label: 'Khẩn Cấp', path: '/emergency' },
    ];

    return (
        <nav className={clsx('bg-white shadow-md py-4')}>
            <div className={clsx('container mx-auto px-4 flex items-center justify-between')}>
                {/* Logo */}
                <div className={clsx('flex items-center gap-2')}>
                    <span className={clsx('text-red-600 text-2xl')}>❤️</span>
                    <span className={clsx('text-lg font-bold text-gray-800')}>
            BloodConnect - Bệnh Viện Da Khoa
          </span>
                </div>

                {/* Menu Items */}
                <div className={clsx('flex items-center gap-6')}>
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={clsx(
                                'text-gray-600 hover:text-red-600 transition-colors',
                                item.path === window.location.pathname && 'text-red-600 border-b-2 border-red-600'
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                    <button
                        onClick={() => navigate('/login')}
                        className={clsx('text-gray-600 hover:text-red-600 transition-colors')}
                    >
                        Đăng Nhập
                    </button>
                    <button
                        onClick={() => navigate('/donate-blood')}
                        className={clsx(
                            'bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2'
                        )}
                    >
                        <span>Đăng Ký Hiến Máu</span>
                        <span>❤️</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;