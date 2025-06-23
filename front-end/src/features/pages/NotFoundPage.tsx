import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Trang không tìm thấy</p>
                <Button asChild>
                    <Link to="/">Về trang chủ</Link>
                </Button>
            </div>
        </div>
    )
}

export default NotFoundPage