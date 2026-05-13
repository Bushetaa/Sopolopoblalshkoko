"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, Shield, Plug, Users2 } from 'lucide-react';

const SETTINGS_TABS = [
  { name: 'General', path: '/settings/general', icon: SlidersHorizontal },
  { name: 'Security', path: '/settings/security', icon: Shield },
  { name: 'Integrations', path: '/settings/integrations', icon: Plug },
  { name: 'Users', path: '/settings/users', icon: Users2 },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Settings Tabs */}
      <div className="border-b border-gray-800 mb-8">
        <nav className="flex gap-6">
          {SETTINGS_TABS.map((tab) => {
            const isActive = pathname === tab.path;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.path}
                className={cn(
                  "flex items-center gap-2 pb-3 px-1 border-b-2 text-sm font-medium transition-colors",
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

      {/* Tab Content */}
      {children}
    </div>
  );
}
