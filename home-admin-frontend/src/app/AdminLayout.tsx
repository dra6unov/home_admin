'use client';

import { useState, type ReactNode } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

export default function AdminLayout({
  children,
  pageTitle = 'Dashboard',
}: AdminLayoutProps) {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-full flex">
      <Sidebar
        expanded={expanded}
        mobileOpen={mobileOpen}
        onToggle={() => setExpanded((prev) => !prev)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${expanded ? 'lg:ml-60' : 'lg:ml-16'}`}
      >
        <Header
          pageTitle={pageTitle}
          mobileMenuOpen={mobileOpen}
          onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
        />

        <main className="flex-1 bg-gray-50 p-3 sm:p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
