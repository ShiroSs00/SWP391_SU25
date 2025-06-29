import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import { Sidebar } from '../../components/ui/sidebar/Sidebar';
// import sidebarItems from 'path-to-your-sidebar-items';

const MainLayout = () => (
  <>
    <Header />
    <div className="flex min-h-screen">
      <Sidebar items={/* sidebarItems */} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
    <Footer />
  </>
);

export default MainLayout;