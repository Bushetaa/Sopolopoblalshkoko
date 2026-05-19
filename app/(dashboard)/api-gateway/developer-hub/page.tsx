"use client";

import React, { useState, useEffect } from 'react';
import { Code2, Terminal, Copy, Check, Search, Globe, Route as RouteIcon, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient, Gateway, GatewayRoute } from '@/lib/api-client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface RouteWithGateway extends GatewayRoute {
  gatewayName: string;
}

export default function DeveloperHubPage() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [routes, setRoutes] = useState<RouteWithGateway[]>([]);
  const [userSlug, setUserSlug] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedRoute, setSelectedRoute] = useState<RouteWithGateway | null>(null);
  const [activeTab, setActiveTab] = useState<'curl' | 'python' | 'node' | 'go'>('curl');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedGateways, fetchedRoutes, profiles] = await Promise.all([
          apiClient.gateways.getAll(),
          apiClient.gatewayRoutes.getAll(),
          apiClient.userProfiles.getAll().catch(() => [])
        ]);

        if (profiles && profiles.length > 0) {
          setUserSlug(profiles[0].slug);
        }

        const activeGateways = fetchedGateways.filter(g => g.is_active);
        setGateways(activeGateways);

        const formattedRoutes = fetchedRoutes.map(rt => {
          const gw = activeGateways.find(g => g.id === rt.gateway_id);
          return {
            ...rt,
            gatewayName: gw?.name || 'Unknown Gateway'
          };
        }).filter(rt => rt.gatewayName !== 'Unknown Gateway'); // Only routes belonging to active gateways

        setRoutes(formattedRoutes);
        if (formattedRoutes.length > 0) {
          setSelectedRoute(formattedRoutes[0]);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter routes based on search
  const filteredRoutes = routes.filter(rt => 
    rt.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rt.gatewayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rt.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group routes by Gateway
  const groupedRoutes = filteredRoutes.reduce((acc, route) => {
    if (!acc[route.gatewayName]) {
      acc[route.gatewayName] = [];
    }
    acc[route.gatewayName].push(route);
    return acc;
  }, {} as Record<string, RouteWithGateway[]>);

  const getFullUrl = (route: RouteWithGateway) => {
    const baseUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:5000';
    const path = route.path.startsWith('/') ? route.path : `/${route.path}`;
    const slugStr = userSlug ? `/${userSlug}` : '';
    return `${baseUrl}${slugStr}${path}`;
  };

  const getSnippets = (route: RouteWithGateway) => {
    const url = getFullUrl(route);
    const method = route.method;
    return {
      curl: `curl -X ${method} \\\n  '${url}' \\\n  -H 'Accept: application/json'`,
      python: `import requests\n\nurl = "${url}"\nheaders = {"Accept": "application/json"}\n\nresponse = requests.request("${method}", url, headers=headers)\n\nprint(response.text)`,
      node: `const url = "${url}";\nconst options = {\n  method: "${method}",\n  headers: {\n    "Accept": "application/json"\n  }\n};\n\nfetch(url, options)\n  .then(res => res.json())\n  .then(json => console.log(json))\n  .catch(err => console.error('error:' + err));`,
      go: `package main\n\nimport (\n\t"fmt"\n\t"net/http"\n\t"io"\n)\n\nfunc main() {\n\turl := "${url}"\n\n\treq, _ := http.NewRequest("${method}", url, nil)\n\treq.Header.Add("Accept", "application/json")\n\n\tres, _ := http.DefaultClient.Do(req)\n\tdefer res.Body.Close()\n\n\tbody, _ := io.ReadAll(res.Body)\n\tfmt.Println(string(body))\n}`
    };
  };

  const handleCopy = () => {
    if (!selectedRoute) return;
    const snippets = getSnippets(selectedRoute);
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] -m-6 bg-gray-950">
      {/* Sidebar: Routes List */}
      <div className="w-80 border-r border-gray-800/60 bg-gray-950/50 flex flex-col">
        <div className="p-5 border-b border-gray-800/60">
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2 mb-4">
            <Code2 className="w-5 h-5 text-blue-400" />
            Developer Hub
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-sm rounded-lg pl-9 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {Object.keys(groupedRoutes).length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              <Box className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No routes found
            </div>
          ) : (
            Object.entries(groupedRoutes).map(([gatewayName, gRoutes]) => (
              <div key={gatewayName}>
                <div className="flex items-center gap-2 px-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <Globe className="w-3.5 h-3.5" />
                  {gatewayName}
                </div>
                <div className="space-y-1">
                  {gRoutes.map(rt => {
                    const isSelected = selectedRoute?.id === rt.id;
                    return (
                      <button
                        key={rt.id}
                        onClick={() => setSelectedRoute(rt)}
                        className={cn(
                          "w-full flex flex-col items-start px-3 py-2.5 rounded-lg text-left transition-colors",
                          isSelected ? "bg-blue-600/10 border border-blue-500/20" : "hover:bg-gray-800/40 border border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-2 w-full mb-1">
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded",
                            rt.method === 'GET' ? "bg-emerald-500/15 text-emerald-400" :
                            rt.method === 'POST' ? "bg-blue-500/15 text-blue-400" :
                            "bg-yellow-500/15 text-yellow-400"
                          )}>
                            {rt.method}
                          </span>
                        </div>
                        <span className={cn(
                          "text-sm font-mono truncate w-full",
                          isSelected ? "text-blue-300" : "text-gray-300"
                        )}>
                          {rt.path}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content: Code Viewer */}
      <div className="flex-1 flex flex-col bg-gray-950 overflow-hidden">
        {selectedRoute ? (
          <>
            <div className="p-8 border-b border-gray-800/60 bg-gray-900/20">
              <div className="flex items-center gap-3 mb-2">
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded",
                  selectedRoute.method === 'GET' ? "bg-emerald-500/15 text-emerald-400" :
                  selectedRoute.method === 'POST' ? "bg-blue-500/15 text-blue-400" :
                  "bg-yellow-500/15 text-yellow-400"
                )}>
                  {selectedRoute.method}
                </span>
                <span className="text-gray-500 font-mono text-sm">Route Path</span>
              </div>
              <h1 className="text-2xl font-mono text-white break-all">
                {selectedRoute.path}
              </h1>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" /> Gateway: <span className="text-gray-200">{selectedRoute.gatewayName}</span>
              </div>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              <div className="max-w-4xl">
                <h3 className="text-lg font-bold text-white mb-4">Integration Code</h3>
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-950/50 px-2">
                    {(['curl', 'python', 'node', 'go'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "px-4 py-3 text-sm font-semibold capitalize border-b-2 transition-colors",
                          activeTab === tab
                            ? "border-blue-500 text-blue-400"
                            : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
                        )}
                      >
                        {tab === 'node' ? 'Node.js' : tab}
                      </button>
                    ))}
                  </div>

                  <div className="relative group p-6">
                    <div className="absolute top-0 right-0 p-4 z-10">
                      <button
                        onClick={handleCopy}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all border border-gray-700 shadow-lg"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-gray-800 shadow-inner mt-2 text-[13px] bg-[#1e1e1e]">
                      <SyntaxHighlighter
                        language={activeTab === 'curl' ? 'bash' : activeTab === 'node' ? 'javascript' : activeTab}
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                        showLineNumbers={true}
                      >
                        {getSnippets(selectedRoute)[activeTab]}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <RouteIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Select a route from the sidebar to view integration code</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
