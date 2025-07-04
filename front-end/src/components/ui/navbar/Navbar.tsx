import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn} from "../../../lib/utils.ts";
import { Button} from "../Button";
import { Sheet, SheetContent, SheetTrigger } from "../sheet.tsx";
import { Menu, X, Home, FileText, Droplets, AlertTriangle, Info, Phone, Heart } from "lucide-react"
import {ScrollArea} from "../scroll-area.tsx";


export interface NavItem {
    id: string
    label: string
    href: string
    icon: React.ReactNode
    description?: string
}

export interface NavbarProps {
    className?: string
}

const navItems: NavItem[] = [
    {
        id: "home",
        label: "Trang Chủ",
        href: "/",
        icon: <Home className="h-5 w-5" />,
        description: "Trang chủ hệ thống",
    },
    {
        id: "blog",
        label: "Blog",
        href: "/blog",
        icon: <FileText className="h-5 w-5" />,
        description: "Tin tức và bài viết",
    },
    {
        id: "blood-types",
        label: "Nhóm Máu",
        href: "/blood-types",
        icon: <Droplets className="h-5 w-5" />,
        description: "Thông tin về các nhóm máu",
    },
    {
        id: "emergency",
        label: "Cấp Cứu",
        href: "/emergency",
        icon: <AlertTriangle className="h-5 w-5" />,
        description: "Thông tin cấp cứu khẩn cấp",
    },
    {
        id: "about",
        label: "Giới Thiệu",
        href: "/about",
        icon: <Info className="h-5 w-5" />,
        description: "Về chúng tôi",
    },
    {
        id: "contact",
        label: "Liên Hệ",
        href: "/contact",
        icon: <Phone className="h-5 w-5" />,
        description: "Thông tin liên hệ",
    },
]

const Navbar: React.FC<NavbarProps> = ({ className }) => {
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

    const isActive = (href: string) => {
        if (href === "/") {
            return location.pathname === "/"
        }
        return location.pathname.startsWith(href)
    }

    const handleMenuItemClick = () => {
        setIsMenuOpen(false)
    }

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm",
                className,
            )}
        >
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
                        <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-red-600 leading-none">BloodBank</span>
                        <span className="text-xs text-gray-500 leading-none">Hiến máu cứu người</span>
                    </div>
                </Link>

                {/* Hamburger Menu */}
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Mở menu</span>
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="w-80 p-0 bg-white border-r border-gray-200">
                        {/* Menu Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
                                    <Heart className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg text-red-600 leading-none">BloodBank</span>
                                    <span className="text-xs text-gray-500 leading-none">Hiến máu cứu người</span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMenuOpen(false)}
                                className="h-8 w-8 hover:bg-gray-100"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Menu Content */}
                        <ScrollArea className="flex-1 py-4">
                            <nav className="px-4">
                                <div className="space-y-2">
                                    {navItems.map((item) => {
                                        const active = isActive(item.href)

                                        return (
                                            <Link
                                                key={item.id}
                                                to={item.href}
                                                onClick={handleMenuItemClick}
                                                className={cn(
                                                    "group flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-50",
                                                    active
                                                        ? "bg-red-50 text-red-600 border border-red-200 shadow-sm"
                                                        : "text-gray-700 hover:text-red-600",
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                                                        active
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-red-600",
                                                    )}
                                                >
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{item.label}</div>
                                                    {item.description && <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>}
                                                </div>
                                                {active && <div className="w-2 h-2 rounded-full bg-red-600"></div>}
                                            </Link>
                                        )
                                    })}
                                </div>

                                {/* Menu Footer */}
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="px-4 py-3 bg-red-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600">
                                                <Heart className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-red-900">Cần giúp đỡ?</div>
                                                <div className="text-xs text-red-700">Liên hệ hotline: 1900-1234</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}

export { Navbar }

