import React from 'react';
import { Heart, Users, Clock, Award } from 'lucide-react';

interface HeroProps {
    title: string;
    subtitle: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    onPrimaryClick: () => void;
    onSecondaryClick: () => void;
    backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({
                                       title,
                                       subtitle,
                                       primaryButtonText,
                                       secondaryButtonText,
                                       onPrimaryClick,
                                       onSecondaryClick,
                                       backgroundImage
                                   }) => {
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 overflow-hidden">
            {/* Background Image Overlay */}
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}

            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-20 h-20 bg-red-100 rounded-full opacity-50 animate-pulse"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-pink-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-20 w-24 h-24 bg-red-50 rounded-full opacity-60 animate-pulse delay-500"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                                <Heart className="w-4 h-4 mr-2" />
                                Cứu sống một cuộc đời
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                {title}
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed">
                                {subtitle}
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={onPrimaryClick}
                                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                {primaryButtonText}
                            </button>

                            <button
                                onClick={onSecondaryClick}
                                className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
                            >
                                {secondaryButtonText}
                            </button>
                        </div>

                        {/* Stats - Static data matching the theme */}
                        <div className="grid grid-cols-3 gap-6 pt-8">
                            <div className="text-center">
                                <div className="flex justify-center mb-2">
                                    <Users className="w-8 h-8 text-red-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">25K+</div>
                                <div className="text-sm text-gray-600">Người hiến máu</div>
                            </div>

                            <div className="text-center">
                                <div className="flex justify-center mb-2">
                                    <Heart className="w-8 h-8 text-red-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">89K+</div>
                                <div className="text-sm text-gray-600">Đơn vị máu</div>
                            </div>

                            <div className="text-center">
                                <div className="flex justify-center mb-2">
                                    <Award className="w-8 h-8 text-red-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">157K+</div>
                                <div className="text-sm text-gray-600">Người được cứu</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Hero Visual */}
                    <div className="relative">
                        <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="aspect-square bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center">
                                <div className="text-center space-y-6">
                                    <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                        <Heart className="w-16 h-16 text-white" />
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Kết Nối Sự Sống
                                        </h3>
                                        <p className="text-gray-600">
                                            Mỗi giọt máu là một hy vọng
                                        </p>
                                    </div>

                                    {/* Blood drop animation */}
                                    <div className="flex justify-center space-x-2">
                                        <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce delay-200"></div>
                                    </div>

                                    {/* Mini stats inside card */}
                                    <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                                        <div className="text-center">
                                            <div className="font-semibold text-red-600">47</div>
                                            <div className="text-gray-500">Bệnh viện</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-semibold text-red-600">24/7</div>
                                            <div className="text-gray-500">Hỗ trợ</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-200 rounded-full flex items-center justify-center animate-bounce">
                            <Heart className="w-8 h-8 text-red-600" />
                        </div>

                        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center animate-bounce delay-500">
                            <Clock className="w-6 h-6 text-pink-600" />
                        </div>

                        {/* Medical cross decoration */}
                        <div className="absolute top-1/2 -left-8 w-8 h-8 bg-red-300 rotate-45 opacity-60"></div>
                        <div className="absolute top-1/2 -left-6 w-8 h-2 bg-red-300 opacity-60"></div>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-gray-500 text-sm">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="text-2xl">🏥</div>
                        <span>Đối tác bệnh viện</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <div className="text-2xl">🔒</div>
                        <span>An toàn tuyệt đối</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <div className="text-2xl">⚡</div>
                        <span>Phản hồi nhanh</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <div className="text-2xl">🤝</div>
                        <span>Cộng đồng tin cậy</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;