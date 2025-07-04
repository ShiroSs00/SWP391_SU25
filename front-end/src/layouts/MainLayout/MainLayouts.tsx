import React from "react";
import { Outlet, } from "react-router-dom";
import Footer from "../../components/layouts/Footer";
import { cn } from "../../lib/utils";
import {Header} from "../../components/layouts/Header";

export const MainLayout: React.FC = () => {

    // Sidebar items for navigation


    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar cố định */}
            <Header />

            <div className="flex flex-1">
                {/* Main content */}
                <main className={cn("flex-1 min-h-0")}>
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};