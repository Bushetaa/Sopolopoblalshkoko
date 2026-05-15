"use client";

import React from 'react';
import { Search, Bell, User as UserIcon, Menu, ChevronRight } from 'lucide-react';
import { useLayout } from '@/hooks/useLayout';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Header() {
  const { toggleMobileSidebar } = useLayout();
  const { user } = useAuth();
  const breadcrumbs = useBreadcrumbs();
  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

  return (
    <header className="h-16 sticky top-0 z-20 bg-gray-950 border-b border-gray-800 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex flex-col">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.label}>
                {crumb.path ? (
                  <Link href={crumb.path} className="hover:text-gray-300 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={index === breadcrumbs.length - 1 ? "text-gray-300" : ""}>
                    {crumb.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-3 w-3" />
                )}
              </React.Fragment>
            ))}
          </nav>
          
          {/* Page Title */}
          <h1 className="text-lg font-semibold text-gray-50">
            {lastBreadcrumb?.label || 'Overview'}
          </h1>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-sm mx-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search APIs, Gateways... ⌘K"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-150"
          />
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center gap-2 md:gap-4">
        <Link 
          href="/docs" 
          className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5"
        >
          Docs
        </Link>
        
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center border-2 border-gray-950">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-800 ml-2">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-gray-200">{user?.displayName || 'Guest User'}</span>
            <span className="text-[10px] text-gray-500 uppercase">{user?.defaultRole || 'Guest'}</span>
          </div>
          <Link href="/settings/general" className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-gray-800 overflow-hidden">
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.displayName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <UserIcon className="w-4 h-4" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
