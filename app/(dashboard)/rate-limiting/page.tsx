"use client";

import React from 'react';
import { 
  Zap, 
  ShieldAlert, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Mock data for rate limiting
const POLICY_DATA = [
  { id: 'pol_1', name: 'Global Public Tier', type: 'Fixed Window', limit: '1000 req/min', status: 'active', appliedTo: 'All Public Endpoints', hits: '1.2M' },
  { id: 'pol_2', name: 'Premium Tier 1', type: 'Leaky Bucket', limit: '5000 req/min', status: 'active', appliedTo: 'Gold Partners', hits: '450K' },
  { id: 'pol_3', name: 'Auth Protection', type: 'Sliding Window', limit: '10 req/sec', status: 'active', appliedTo: '/v1/auth/*', hits: '12K' },
  { id: 'pol_4', name: 'Free Tier Limit', type: 'Fixed Window', limit: '100 req/hr', status: 'active', appliedTo: 'Free Users', hits: '2.1M' },
];

const TRAFFIC_STATS = [
  { time: '00:00', allowed: 4000, blocked: 200 },
  { time: '04:00', allowed: 3000, blocked: 150 },
  { time: '08:00', allowed: 7000, blocked: 800 },
  { time: '12:00', allowed: 9500, blocked: 1200 },
  { time: '16:00', allowed: 8000, blocked: 600 },
  { time: '20:00', allowed: 5500, blocked: 300 },
  { time: '23:59', allowed: 4500, blocked: 250 },
];

const TOP_THROTTLED = [
  { client: '192.168.1.45', count: 1240, region: 'US-East', trend: 'up' },
  { client: '84.21.192.3', count: 890, region: 'EU-West', trend: 'down' },
  { client: 'user_9921', count: 560, region: 'Global', trend: 'up' },
  { client: 'api_key_test_88', count: 320, region: 'US-West', trend: 'stable' },
];

export default function RateLimitingPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Zap className="h-8 w-8 text-amber-400 fill-amber-400/20" />
            Rate Limiting
          </h1>
          <p className="text-gray-500 mt-1">Control and monitor traffic flow across your API ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gray-800 bg-gray-900/50 hover:bg-gray-800 text-gray-300">
            <Activity className="h-4 w-4 mr-2" />
            Live Logs
          </Button>
          <Button onClick={() => toast.info('Policy creation coming soon')} className="bg-amber-500 hover:bg-amber-600 text-black font-bold gap-2">
            <Plus className="h-4 w-4" />
            New Policy
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Blocked', value: '3,452', sub: '+12% vs last 24h', icon: ShieldAlert, color: 'text-red-400' },
          { label: 'Active Policies', value: '14', sub: 'Across 5 regions', icon: Zap, color: 'text-amber-400' },
          { label: 'Avg Latency', value: '1.2ms', sub: 'Overhead from RL', icon: Clock, color: 'text-blue-400' },
          { label: 'Health Score', value: '98.2%', sub: 'No outages reported', icon: Activity, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
            <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
            <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
              {stat.sub.includes('+') ? <ArrowUpRight className="h-3 w-3 text-red-400" /> : <ArrowDownRight className="h-3 w-3 text-emerald-400" />}
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-gray-100 flex items-center gap-2">
                Traffic Enforcement
                <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/20 text-emerald-400 bg-emerald-500/5">REAL-TIME</Badge>
              </h3>
              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> ALLOWED
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" /> BLOCKED
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TRAFFIC_STATS}>
                  <defs>
                    <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => `${val/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="allowed" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorAllowed)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="blocked" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorBlocked)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Policies List */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-gray-100">Active Policies</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                <Input placeholder="Search policies..." className="pl-9 h-8 text-xs bg-gray-950 border-gray-800" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-950/50">
                    <th className="px-6 py-3">Policy Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Limit</th>
                    <th className="px-6 py-3">Hits (24h)</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {POLICY_DATA.map((policy) => (
                    <tr key={policy.id} className="group hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-200">{policy.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{policy.appliedTo}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="font-normal border-gray-700 text-gray-400">
                          {policy.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{policy.limit}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{policy.hits}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs uppercase font-bold tracking-tight">Active</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          {/* Top Throttled Clients */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-100 mb-6 flex items-center justify-between">
              Throttled Clients
              <Button variant="ghost" size="sm" className="text-[10px] h-6 text-blue-400">VIEW ALL</Button>
            </h3>
            <div className="space-y-4">
              {TOP_THROTTLED.map((client, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-950/50 border border-gray-800 group hover:border-red-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{client.client}</p>
                      <p className="text-[10px] text-gray-500">{client.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-200">{client.count}</p>
                    <p className={cn(
                      "text-[10px] font-bold",
                      client.trend === 'up' ? 'text-red-400' : 'text-emerald-400'
                    )}>
                      {client.trend === 'up' ? 'SPIKING' : 'NORMAL'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-500 uppercase">Proactive Insight</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Client <span className="text-gray-200">192.168.1.45</span> has hit the global rate limit 4 times in the last hour. Consider banning this IP.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-100 mb-6">Algorithm Distribution</h3>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Fixed', val: 45 },
                  { name: 'Sliding', val: 30 },
                  { name: 'Leaky', val: 25 },
                ]}>
                  <XAxis dataKey="name" fontSize={10} stroke="#4b5563" axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#f59e0b" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Fixed Window</span>
                <span className="text-gray-300 font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[45%]" />
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-500">Sliding Window</span>
                <span className="text-gray-300 font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[30%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
