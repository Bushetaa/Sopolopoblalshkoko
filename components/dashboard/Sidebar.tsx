"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MENU_SECTIONS } from '@/constants/navigation';
import { MenuItem } from '@/types/layout';

export default function Sidebar({ className, onItemClick }: { className?: string, onItemClick?: () => void }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['API Manager']));

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleItem = (itemName: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemName)) {
        next.delete(itemName);
      } else {
        next.add(itemName);
      }
      return next;
    });
  };

  const isParentActive = (item: MenuItem): boolean => {
    if (!mounted) return false;
    const isCurrentPath = pathname === item.path;
    if (item.subItems) {
      return isCurrentPath || item.subItems.some(sub => pathname === sub.path);
    }
    return isCurrentPath;
  };

  const isSubItemActive = (path: string): boolean => mounted ? pathname === path : false;
  
  const handleItemClick = (item: MenuItem) => {
    if (!item.subItems && onItemClick) {
      onItemClick();
    }
    if (item.subItems) {
      toggleItem(item.name);
    }
  };
  
  return (
    <aside className={cn("w-64 bg-gray-950 border-r border-gray-800 h-screen sticky top-0 z-30 flex flex-col", className)}>
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
          onClick={onItemClick}
        >
          <img 
            src="/assets/sopo_logo_1771857176169.png" 
            alt="Sopo Logo" 
            className="w-8 h-8 object-contain group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all" 
          />
          <span className="text-xl font-bold text-gray-50 tracking-tight uppercase font-display">Sopo</span>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-medium">v2.0</span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
        {MENU_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isExpanded = expandedItems.has(item.name);
                const active = isParentActive(item);

                return (
                  <div key={item.name} className="space-y-1">
                    <div
                      className={cn(
                        "group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-150",
                        active 
                          ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-500 rounded-l-none" 
                          : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
                      )}
                    >
                      <Link 
                        href={item.path}
                        className="flex items-center gap-3 flex-1"
                        onClick={() => handleItemClick(item)}
                      >
                        <Icon className={cn("h-4 w-4", active ? "text-blue-400" : "text-gray-400 group-hover:text-gray-200")} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                      
                      {item.badge && (
                        <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full mr-2">
                          {item.badge}
                        </span>
                      )}

                      {item.subItems && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleItem(item.name);
                          }}
                          className="p-1 hover:bg-gray-700/50 rounded-md transition-colors"
                        >
                          <ChevronRight 
                            className={cn(
                              "h-4 w-4 text-gray-500 transition-transform duration-200",
                              isExpanded && "rotate-90"
                            )} 
                          />
                        </button>
                      )}
                    </div>

                    {/* Sub-items Container */}
                    {item.subItems && (
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300 ease-in-out ml-3 pl-3 border-l border-gray-800 mt-1 space-y-0.5",
                          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        )}
                      >
                        {item.subItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const subActive = isSubItemActive(sub.path);
                          return (
                            <Link
                              key={sub.path}
                              href={sub.path}
                              onClick={onItemClick}
                              className={cn(
                                "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors",
                                subActive
                                  ? "text-blue-400 font-medium"
                                  : "text-gray-500 hover:text-gray-200"
                              )}
                            >
                              {SubIcon && <SubIcon className="h-3.5 w-3.5" />}
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-800 bg-gray-950">
        <div className="flex items-center justify-between group px-2 py-2 rounded-lg hover:bg-gray-800/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center overflow-hidden">
              <img 
                src="/assets/sopo_logo_1771857176169.png" 
                alt="Sopo Team" 
                className="w-6 h-6 object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-100">Sopo Team</span>
              <span className="text-xs text-gray-500">Admin</span>
            </div>
          </div>
          <Link 
            href="/"
            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
