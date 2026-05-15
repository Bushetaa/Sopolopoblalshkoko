"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, LogOut, PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MENU_SECTIONS } from '@/constants/navigation';
import { MenuItem } from '@/types/layout';
import { useLayout } from '@/hooks/useLayout';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar({ className, onItemClick }: { className?: string, onItemClick?: () => void }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['Gateway Manager']));
  const { isSidebarCollapsed, toggleSidebarCollapsed } = useLayout();
  const { logout } = useAuth();

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
      return isCurrentPath || item.subItems.some(sub => pathname === sub.path || pathname.startsWith(sub.path + '/'));
    }
    return isCurrentPath || pathname.startsWith(item.path + '/');
  };

  const isSubItemActive = (path: string): boolean => {
    if (!mounted) return false;
    return pathname === path || pathname.startsWith(path + '/');
  };

  const handleItemClick = (item: MenuItem) => {
    if (!item.subItems && onItemClick) {
      onItemClick();
    }
    if (item.subItems) {
      toggleItem(item.name);
    }
  };

  const collapsed = isSidebarCollapsed;

  return (
    <aside
      className={cn(
        "bg-gray-950/95 backdrop-blur-xl border-r border-gray-800/60 h-screen sticky top-0 z-30 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-64",
        className
      )}
    >
      {/* Logo Section */}
      <div className={cn("h-16 flex items-center border-b border-gray-800/60", collapsed ? "px-3 justify-center" : "px-5")}>
        <Link
          href="/"
          className="flex items-center gap-3 group"
          onClick={onItemClick}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:shadow-blue-500/30 transition-shadow shrink-0">
            <img
              src="/assets/sopo_logo_1771857176169.png"
              alt="Sopo Logo"
              className="w-5 h-5 object-contain brightness-0 invert"
            />
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-50 tracking-tight uppercase font-display">Sopo</span>
              <span className="text-[9px] bg-blue-500/15 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-md font-semibold">v2</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className={cn("flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent", collapsed ? "py-4 px-2" : "py-5 px-3")}>
        <div className="space-y-6">
          {MENU_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 mb-2 text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em]">
                  {section.title}
                </h3>
              )}
              {collapsed && (
                <div className="w-6 h-px bg-gray-800 mx-auto mb-2" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isExpanded = expandedItems.has(item.name);
                  const active = isParentActive(item);

                  return (
                    <div key={item.name}>
                      {/* Parent Item */}
                      <div
                        className={cn(
                          "group flex items-center justify-between rounded-lg cursor-pointer transition-all duration-150 relative",
                          collapsed ? "px-0 py-2 justify-center" : "px-3 py-2",
                          active
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                        )}
                      >
                        {/* Active indicator bar */}
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-full" />
                        )}

                        <Link
                          href={item.path}
                          className={cn("flex items-center gap-3 flex-1", collapsed && "justify-center")}
                          onClick={() => handleItemClick(item)}
                          title={collapsed ? item.name : undefined}
                        >
                          <Icon className={cn(
                            "h-[18px] w-[18px] shrink-0 transition-colors",
                            active ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"
                          )} />
                          {!collapsed && (
                            <span className="text-[13px] font-medium truncate">{item.name}</span>
                          )}
                        </Link>

                        {!collapsed && item.badge && (
                          <span className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded-md mr-1",
                            item.badgeVariant === "label"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                              : "bg-blue-500 text-white"
                          )}>
                            {item.badge}
                          </span>
                        )}

                        {!collapsed && item.subItems && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleItem(item.name);
                            }}
                            className="p-1 hover:bg-gray-700/40 rounded-md transition-colors"
                          >
                            <ChevronRight
                              className={cn(
                                "h-3.5 w-3.5 text-gray-600 transition-transform duration-200",
                                isExpanded && "rotate-90 text-gray-400"
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {/* Sub-items Container */}
                      {!collapsed && item.subItems && (
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out ml-[21px] pl-3 border-l border-gray-800/50 mt-0.5 space-y-0.5",
                            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          )}
                        >
                          {item.subItems.map((sub) => {
                            const SubIcon = sub.icon;
                            const subActive = isSubItemActive(sub.path);
                            return (
                              <Link
                                key={sub.name + sub.path}
                                href={sub.path}
                                onClick={onItemClick}
                                className={cn(
                                  "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[12px] transition-all duration-100",
                                  subActive
                                    ? "text-blue-400 font-semibold bg-blue-500/5"
                                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
                                )}
                              >
                                {SubIcon && <SubIcon className={cn("h-3.5 w-3.5", subActive ? "text-blue-400" : "text-gray-600")} />}
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
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-2 border-t border-gray-800/40">
        <button
          onClick={toggleSidebarCollapsed}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800/40 transition-all duration-150",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeft className="h-[18px] w-[18px]" />
          ) : (
            <>
              <PanelLeftClose className="h-[18px] w-[18px]" />
              <span className="text-[12px] font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User Profile Section */}
      <div className={cn("border-t border-gray-800/60 bg-gray-950/80", collapsed ? "p-2" : "p-3")}>
        <div className={cn(
          "flex items-center rounded-lg hover:bg-gray-800/40 transition-colors",
          collapsed ? "justify-center p-2" : "justify-between px-3 py-2"
        )}>
          <div className={cn("flex items-center", collapsed ? "" : "gap-3")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src="/assets/sopo_logo_1771857176169.png"
                alt="Sopo Team"
                className="w-5 h-5 object-contain"
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-medium text-gray-200 truncate">Sopo Team</span>
                <span className="text-[10px] text-gray-500">Admin</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => logout()}
              className="p-1.5 text-gray-600 hover:text-red-400 rounded-md hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
