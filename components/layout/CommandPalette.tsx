"use client";

import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { Search, FileText, Link2, FolderOpen, Activity, Gauge, Settings } from 'lucide-react';
import { useLayout } from '@/hooks/useLayout';

export default function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useLayout();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <Command 
        className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-gray-800 px-4">
          <Search className="h-5 w-5 text-gray-500" />
          <Command.Input 
            placeholder="Search APIs, Gateways, Workspaces..." 
            className="w-full bg-transparent border-none py-4 px-3 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-0 text-lg"
          />
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
          <Command.Empty className="py-6 text-center text-gray-500 text-sm">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <Command.Item className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 aria-selected:bg-gray-800 aria-selected:text-white cursor-pointer transition-colors">
              <FolderOpen className="h-4 w-4" />
              <span>Collections</span>
            </Command.Item>
            <Command.Item className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 aria-selected:bg-gray-800 aria-selected:text-white cursor-pointer transition-colors">
              <Link2 className="h-4 w-4" />
              <span>Endpoints</span>
            </Command.Item>
            <Command.Item className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 aria-selected:bg-gray-800 aria-selected:text-white cursor-pointer transition-colors">
              <FileText className="h-4 w-4" />
              <span>Documentation</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Monitoring" className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
            <Command.Item className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 aria-selected:bg-gray-800 aria-selected:text-white cursor-pointer transition-colors">
              <Activity className="h-4 w-4" />
              <span>Traffic Analysis</span>
            </Command.Item>
            <Command.Item className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 aria-selected:bg-gray-800 aria-selected:text-white cursor-pointer transition-colors">
              <Gauge className="h-4 w-4" />
              <span>Performance</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Settings" className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
            <Command.Item className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 aria-selected:bg-gray-800 aria-selected:text-white cursor-pointer transition-colors">
              <Settings className="h-4 w-4" />
              <span>General Settings</span>
            </Command.Item>
          </Command.Group>
        </Command.List>

        <div className="flex items-center justify-between border-t border-gray-800 px-4 py-3 bg-gray-950/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-300">↵</kbd>
              <span>to select</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-300">↑↓</kbd>
              <span>to navigate</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-300">esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </Command>
    </div>
  );
}
