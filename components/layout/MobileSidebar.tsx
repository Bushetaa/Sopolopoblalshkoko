"use client";

import React from 'react';
import { useLayout } from '@/hooks/useLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export default function MobileSidebar() {
  const { isMobileSidebarOpen, closeMobileSidebar } = useLayout();

  return (
    <div className={cn(
      "fixed inset-0 z-40 lg:hidden transition-all duration-300",
      isMobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
    )}>
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isMobileSidebarOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={closeMobileSidebar}
      />
      
      {/* Sidebar Panel */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-64 bg-gray-950 transition-transform duration-300 ease-in-out shadow-2xl",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Close Button */}
        <button 
          onClick={closeMobileSidebar}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white z-50 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <Sidebar 
          className="w-full border-none" 
          onItemClick={closeMobileSidebar}
        />
      </div>
    </div>
  );
}
