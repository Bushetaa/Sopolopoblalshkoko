"use client";

import React from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Users, 
  Globe, 
  Shield, 
  Code2, 
  Settings2,
  ExternalLink,
  Trash2,
  Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MOCK_WORKSPACES, 
  MOCK_USERS, 
  Workspace 
} from '@/lib/users-mock';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function WorkspacesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredWorkspaces = MOCK_WORKSPACES.filter(ws => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMemberCount = (workspaceId: string) => {
    return MOCK_USERS.filter(user => user.workspaceIds.includes(workspaceId)).length;
  };

  const getWorkspaceStats = (workspaceId: string) => {
    // Mock stats for display
    const statsMap: Record<string, { apis: number, traffic: string, health: number }> = {
      'ws_1': { apis: 24, traffic: '1.2M', health: 99.9 },
      'ws_2': { apis: 12, traffic: '450K', health: 98.5 },
      'ws_3': { apis: 8, traffic: '890K', health: 100 },
      'ws_4': { apis: 4, traffic: '12K', health: 95.2 },
      'ws_5': { apis: 15, traffic: '2.1M', health: 99.7 },
    };
    return statsMap[workspaceId] || { apis: 0, traffic: '0', health: 100 };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-gray-500 mt-1">Manage your team's isolated environments and resources.</p>
        </div>
        <Button onClick={() => toast.info('Workspace creation coming soon')} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="h-4 w-4" />
          Create Workspace
        </Button>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search workspaces..." 
            className="pl-10 bg-gray-900/50 border-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkspaces.map((ws) => {
          const memberCount = getMemberCount(ws.id);
          const stats = getWorkspaceStats(ws.id);
          
          return (
            <div 
              key={ws.id}
              className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-gray-900/60 transition-all duration-300 overflow-hidden"
            >
              {/* Background Accent */}
              <div className={cn(
                "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-[0.03] group-hover:opacity-[0.07] transition-opacity",
                ws.color
              )} />

              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
                    ws.color
                  )}>
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-50 group-hover:text-white transition-colors">
                      {ws.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-gray-800/50 border-gray-700 text-gray-400 font-normal py-0">
                        {ws.id.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {memberCount} members
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-800 text-gray-300">
                    <DropdownMenuItem className="gap-2 focus:bg-gray-800 focus:text-white cursor-pointer">
                      <Edit2 className="h-4 w-4" /> Edit Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 focus:bg-gray-800 focus:text-white cursor-pointer">
                      <Settings2 className="h-4 w-4" /> Manage Resources
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem className="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                      <Trash2 className="h-4 w-4" /> Delete Workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-800/50">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">APIs</p>
                  <p className="text-lg font-semibold text-gray-100">{stats.apis}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Traffic</p>
                  <p className="text-lg font-semibold text-gray-100">{stats.traffic}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Health</p>
                  <p className="text-lg font-semibold text-emerald-400">{stats.health}%</p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-6 flex items-center gap-2">
                <Button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 h-9 gap-2">
                  <Code2 className="h-4 w-4" />
                  Console
                </Button>
                <Button variant="ghost" className="bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 h-9 gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View
                </Button>
              </div>
            </div>
          );
        })}

        {/* Create New Card (Empty State) */}
        <button 
          onClick={() => toast.info('Workspace creation coming soon')}
          className="group border-2 border-dashed border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-gray-700 hover:bg-gray-900/20 transition-all min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">
            <Plus className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-400 group-hover:text-gray-200 transition-colors">Add Workspace</p>
            <p className="text-xs text-gray-600 mt-1">Create a new isolated environment</p>
          </div>
        </button>
      </div>
    </div>
  );
}
