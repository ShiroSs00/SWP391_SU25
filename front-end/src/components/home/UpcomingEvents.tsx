import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { CalendarIcon, MapPinIcon, ClockIcon, UsersIcon, ArrowRightIcon, HeartIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents } from "../../features/event/hooks/useEvents";
import type { AdminEvent } from "../../features/event/types/admin.types";

export function UpcomingEventsSection() {
    const navigate = useNavigate();
    const [upcomingEvents, setUpcomingEvents] = useState<AdminEvent[]>([]);
    const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUpcomingEvents = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const events = await getAllEvents();
            console.log('Events from getAllEvents:', events);

            const today = new Date();
            const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

            const filteredEvents = events.filter((event: AdminEvent): event is AdminEvent =>
                (event.status === 'UPCOMING' || event.status === 'ONGOING') &&
                !!event.startDate &&
                new Date(event.startDate) >= thirtyDaysAgo && // Bao gồm 30 ngày qua
                new Date(event.startDate) <= nextMonth
            );
            console.log('Filtered events:', filteredEvents);

            const upcomingEvents: AdminEvent[] = filteredEvents.slice(0, 3);
            setUpcomingEvents(upcomingEvents);
        } catch (err: any) {
            console.error('Error fetching upcoming events:', err.message, err);
            setError(err.message || 'Không thể tải sự kiện sắp tới. Vui lòng thử lại sau.');
            setUpcomingEvents([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUpcomingEvents();
    }, []);

    useEffect(() => {
        console.log('Updated upcomingEvents:', upcomingEvents);
    }, [upcomingEvents]);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const newTimeLeft: { [key: string]: string } = {};

            upcomingEvents.forEach((event) => {
                if (event.startDate) {
                    const eventDate = new Date(event.startDate).getTime();
                    const distance = eventDate - now;

                    if (distance > 0) {
                        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

                        newTimeLeft[event.eventId] = `${days}d ${hours}h ${minutes}m`;
                    } else {
                        newTimeLeft[event.eventId] = "Đã bắt đầu";
                    }
                }
            });

            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [upcomingEvents]);

    const getProgressPercentage = (actual: number = 0, expected: number = 1) => {
        return Math.min((actual / expected) * 100, 100);
    };

    const formatEventTime = (startDate?: string, endDate?: string) => {
        if (!startDate) return "Chưa xác định";

        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;

        const startTime = start.toLocaleTimeString("vi-VN", {
            hour: '2-digit',
            minute: '2-digit',
        });

        if (end) {
            const endTime = end.toLocaleTimeString("vi-VN", {
                hour: '2-digit',
                minute: '2-digit',
            });
            return `${startTime} - ${endTime}`;
        }

        return `Từ ${startTime}`;
    };

    const handleRegisterEvent = () => {
        navigate("/donation");
    };

    const handleOrganizeEvent = () => {
        navigate("/contact");
    };

    const handleViewAllEvents = () => {
        navigate("/events");
    };

    if (isLoading) {
        return (
            <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-rose-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                            <div className="h-12 bg-gray-200 rounded w-96 mx-auto"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-rose-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-6">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Sự kiện sắp tới
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Tham gia các
                        <span className="block bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                            sự kiện hiến máu
                        </span>
                    </h2>

                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Đăng ký tham gia các sự kiện hiến máu trong cộng đồng và góp phần cứu sống nhiều người
                    </p>

                    {error && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 text-sm">{error}</p>
                            <button
                                onClick={fetchUpcomingEvents}
                                className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}
                </div>

                {/* Events Grid */}
                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                        {upcomingEvents.map((event) => (
                            <Card
                                key={event.eventId}
                                className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                                padding="none"
                            >
                                {/* Event Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={`https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=400`}
                                        alt={event.nameOfEvent}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                    {/* Status Badge */}
                                    <div className="absolute top-4 left-4">
                                        <Badge
                                            variant={event.status === 'ÔNGUI' ? 'destructive' : 'default'}
                                            className={event.status === 'urgent' ? 'animate-pulse' : ''}
                                        >
                                            {event.status === 'ONGOING' ? 'Khẩn cấp' : 'UPCOMING'}
                                        </Badge>
                                    </div>

                                    {/* Countdown */}
                                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-mono">
                                        {timeLeft[event.eventId] || "Đang tính..."}
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                                        {event.nameOfEvent}
                                    </h3>

                                    {/* Event Details */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <CalendarIcon className="w-4 h-4 mr-2 text-red-500" />
                                            {event.startDate ? new Date(event.startDate).toLocaleDateString("vi-VN") : "Chưa xác định"}
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <ClockIcon className="w-4 h-4 mr-2 text-red-500" />
                                            {formatEventTime(event.startDate, event.endDate)}
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <MapPinIcon className="w-4 h-4 mr-2 text-red-500" />
                                            {event.location}
                                        </div>
                                    </div>

                                    {/* Blood Volume Progress */}
                                    {event.expectedBloodVolume && (
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Tiến độ thu thập (ml)</span>
                                                <span className="text-sm text-gray-600">
                                                    {event.actualVolume || 0}/{event.expectedBloodVolume}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${getProgressPercentage(event.actualVolume, event.expectedBloodVolume)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA Button */}
                                    <button
                                        onClick={handleRegisterEvent}
                                        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center group"
                                    >
                                        <UsersIcon className="w-4 h-4 mr-2" />
                                        Đăng ký tham gia
                                        <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <CalendarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sự kiện nào</h3>
                        <p className="text-gray-600">Hiện tại chưa có sự kiện hiến máu nào được lên lịch trong thời gian tới.</p>
                    </div>
                )}

                {/* CTA Section */}
                <div className="text-center">
                    <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className=" relative z-10">
                            <HeartIcon className="w-16 h-16 mx-auto mb-6 animate-pulse" />
                            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Tổ chức sự kiện hiến máu</h3>
                            <p className="text-lg sm:text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                                Bạn muốn tổ chức sự kiện hiến máu tại tổ chức, trường học hay cộng đồng của mình?
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleOrganizeEvent}
                                    className="bg-white text-red-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-red-50 transition-colors duration-200 transform hover:scale-105"
                                >
                                    Đăng ký tổ chức sự kiện
                                </button>
                                <button
                                    onClick={handleViewAllEvents}
                                    className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white hover:text-red-600 transition-all duration-200 transform hover:scale-105"
                                >
                                    Xem lịch sự kiện đầy đủ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default UpcomingEventsSection;