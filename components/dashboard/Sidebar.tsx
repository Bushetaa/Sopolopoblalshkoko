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
  const { logout, user } = useAuth();

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

  const isSubItemActive = (path: string, item?: MenuItem): boolean => {
    if (!mounted) return false;

    // Exact match
    if (pathname === path) return true;

    // Sub-path match (e.g., /services/123 should highlight /services)
    if (pathname.startsWith(path + '/')) {
      // If we are checking "/api-gateway" but the path is actually something more specific like "/api-gateway/services"
      // we need to make sure this is the "best" match.
      const section = MENU_SECTIONS.find(s => s.items.some(i => i.name === 'Gateway Manager'));
      const gatewayManager = section?.items.find(i => i.name === 'Gateway Manager');

      if (gatewayManager?.subItems) {
        const betterMatch = gatewayManager.subItems.some(sub =>
          sub.path !== path &&
          pathname.startsWith(sub.path) &&
          sub.path.length > path.length
        );
        return !betterMatch;
      }
      return true;
    }
    return false;
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
          <div className="w-16 h-10 flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-lg">
            <img
              src="/assets/sopo_logo_new.gif"
              alt="Sopo Logo"
              className="w-full h-full object-contain"
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
                            const subActive = isSubItemActive(sub.path, item);
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
      <div className={cn(
        "border-t border-gray-800/60 bg-gray-950/40 backdrop-blur-md",
        collapsed ? "p-2" : "p-3"
      )}>
        <div className={cn(
          "relative group/profile flex items-center rounded-xl transition-all duration-500",
          collapsed ? "justify-center p-1.5" : "justify-between px-2.5 py-2 hover:bg-white/[0.03] border border-transparent hover:border-white/5 shadow-2xl"
        )}>
          {/* Subtle Glow Effect */}
          {!collapsed && (
            <div className="absolute inset-0 bg-blue-500/5 blur-xl opacity-0 group-hover/profile:opacity-100 transition-opacity duration-700 rounded-xl pointer-events-none" />
          )}

          <div className={cn("flex items-center relative z-10", collapsed ? "" : "gap-2.5 min-w-0")}>
            <div className={cn(
              "relative shrink-0 transition-transform duration-500 group-hover/profile:scale-105",
              collapsed ? "w-8 h-8" : "w-9 h-9"
            )}>
              <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-lg opacity-0 group-hover/profile:opacity-40 transition-opacity" />
              <div className="relative w-full h-full rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center overflow-hidden ring-1 ring-white/5 shadow-inner">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">
                      {user?.displayName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              {/* Online Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gray-950 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
            </div>

            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-black text-gray-100 truncate leading-tight group-hover/profile:text-white transition-colors">
                  {user?.displayName || 'Sopo User'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] text-gray-500 font-black uppercase tracking-[0.15em]">
                    {user?.defaultRole || 'Member'}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-gray-800" />
                  <span className="text-[8px] text-blue-500/60 font-bold uppercase tracking-widest">Active</span>
                </div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => logout()}
              className="relative z-10 p-1.5 text-gray-600 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-300 group/logout active:scale-90"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5 transition-transform group-hover/logout:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
