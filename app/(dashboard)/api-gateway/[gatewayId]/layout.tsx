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
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/api-gateway" 
              className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold font-display text-gray-50">
                  {gateway?.name || 'Loading...'}
                </h2>
                {gateway && (
                  <>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md border",
                      gateway.is_active 
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-gray-800 text-gray-400 border-gray-700"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", gateway.is_active ? "bg-green-400" : "bg-gray-500")} />
                      {gateway.is_active ? "Active" : "Inactive"}
                    </span>
                    <span className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                      gateway.mode === 'pro'
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    )}>
                      {gateway.mode === 'pro' ? 'PRO' : 'SINGLE'}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {gateway?.description || <span className="font-mono">Gateway ID: {gatewayId}</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <nav className="flex gap-6">
            {visibleTabs.map((tab) => {
              const fullPath = `${basePath}${tab.path}`;
              // For the exact match of settings (base path) vs others
              const isActive = tab.path === '' 
                ? pathname === basePath 
                : pathname.startsWith(fullPath);

              const Icon = tab.icon;

              return (
                <Link
                  key={tab.name}
                  href={fullPath}
                  className={cn(
                    "flex items-center gap-2 pb-3 px-1 border-b-2 font-medium transition-colors",
                    isActive 
                      ? "border-blue-500 text-blue-400" 
                      : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
