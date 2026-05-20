"use client";

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ArrowLeft, Settings, FolderOpen, Server, Route as RouteIcon, Plug, Globe } from 'lucide-react';
import { apiClient, Gateway } from '@/lib/api-client';

const TABS = [
  { name: 'Settings', path: '', icon: Settings },
  { name: 'Collections', path: '/collections', icon: FolderOpen },
  { name: 'Services', path: '/services', icon: Server },
  { name: 'Routes', path: '/routes', icon: RouteIcon },
  { name: 'Plugins', path: '/plugins', icon: Plug },
];

export default function GatewayLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ gatewayId: string }>;
}) {
  const pathname = usePathname();
  const { gatewayId } = use(params);
  const [gateway, setGateway] = useState<Gateway | null>(null);
  
  const basePath = `/api-gateway/${gatewayId}`;

  useEffect(() => {
    const fetchGateway = async () => {
      try {
        const gw = await apiClient.gateways.getById(gatewayId);
        setGateway(gw);
      } catch (error) {
        console.error("Failed to fetch gateway", error);
      }
    };
    if (gatewayId) fetchGateway();
  }, [gatewayId]);

  const isProMode = gateway?.mode === 'pro';

  const visibleTabs = TABS.filter(tab => {
    if (tab.name === 'Collections' && !isProMode) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto h-full flex flex-col pb-10">
      {/* Header Section - Premium Style */}
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <Link 
              href="/api-gateway" 
              className="group flex items-center justify-center w-12 h-12 bg-[#0F172A] border border-white/5 rounded-2xl text-[#64748B] hover:text-white hover:border-white/10 hover:bg-[#1E293B] transition-all shadow-xl active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.25)] relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Globe className="w-7 h-7 text-white stroke-[2.5px]" />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-3xl font-black font-display text-white tracking-tight">
                    {gateway?.name || 'Loading...'}
                  </h2>
                  {gateway && (
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border",
                        gateway.is_active 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                          : "bg-gray-800 text-gray-400 border-gray-700"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", gateway.is_active ? "bg-emerald-400" : "bg-gray-500")} />
                        {gateway.is_active ? "Live" : "Inactive"}
                      </span>
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border",
                        gateway.mode === 'pro'
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                      )}>
                        {gateway.mode === 'pro' ? 'Enterprise' : 'Standalone'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="hidden md:block w-px h-8 bg-white/10" />
                <p className="text-[#94A3B8] font-medium text-sm flex items-center gap-2">
                  {gateway?.description || (
                    <>
                      <span className="opacity-50">Infrastructure ID:</span>
                      <span className="font-mono text-xs bg-white/5 px-2 py-0.5 rounded text-blue-400/80">{gatewayId}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tabs - High Density Style */}
        <div className="relative">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <nav className="flex gap-2 p-1 bg-[#0F172A]/50 backdrop-blur-sm border border-white/5 rounded-2xl w-fit mx-auto">
            {visibleTabs.map((tab) => {
              const fullPath = `${basePath}${tab.path}`;
              const isActive = tab.path === '' 
                ? pathname === basePath 
                : pathname.startsWith(fullPath);

              const Icon = tab.icon;

              return (
                <Link
                  key={tab.name}
                  href={fullPath}
                  className={cn(
                    "flex items-center gap-2.5 py-2.5 px-5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all relative group",
                    isActive 
                      ? "bg-[#2563EB] text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]" 
                      : "text-[#64748B] hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                  {tab.name}
                  {isActive && (
                    <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full blur-[2px]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area - Premium Card Style */}
      <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </div>
    </div>
  );
}
