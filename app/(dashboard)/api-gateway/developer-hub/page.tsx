"use client";

import React, { useState, useEffect } from 'react';
import { Code2, Terminal, Copy, Check, Search, Globe, Route as RouteIcon, Box, ChevronDown, ChevronRight } from 'lucide-react';
import { SiCurl, SiPython, SiNodedotjs, SiGo } from '@icons-pack/react-simple-icons';
import { cn } from '@/lib/utils';
import { apiClient, Gateway, GatewayRoute } from '@/lib/api-client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface RouteWithGateway extends GatewayRoute {
  gatewayName: string;
}

const PythonIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className={className}>
    <linearGradient id="python-original-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stopColor="#5A9FD4"/><stop offset="1" stopColor="#306998"/></linearGradient><linearGradient id="python-original-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stopColor="#FFD43B"/><stop offset="1" stopColor="#FFE873"/></linearGradient><path fill="url(#python-original-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z" transform="translate(0 10.26)"/><path fill="url(#python-original-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z" transform="translate(0 10.26)"/><radialGradient id="python-original-c" cx="1825.678" cy="444.45" r="26.743" gradientTransform="matrix(0 -.24 -1.055 0 532.979 557.576)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#B8B8B8" stopOpacity=".498"/><stop offset="1" stopColor="#7F7F7F" stopOpacity="0"/></radialGradient><path opacity=".444" fill="url(#python-original-c)" d="M97.309 119.597c0 3.543-14.816 6.416-33.091 6.416-18.276 0-33.092-2.873-33.092-6.416 0-3.544 14.815-6.417 33.092-6.417 18.275 0 33.091 2.872 33.091 6.417z"/>
  </svg>
);

export default function DeveloperHubPage() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [routes, setRoutes] = useState<RouteWithGateway[]>([]);
  const [userSlug, setUserSlug] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedRoute, setSelectedRoute] = useState<RouteWithGateway | null>(null);
  const [activeTab, setActiveTab] = useState<'curl' | 'python' | 'node' | 'go'>('curl');
  const [copied, setCopied] = useState(false);
  const [collapsedGateways, setCollapsedGateways] = useState<Record<string, boolean>>({});

  const toggleGateway = (gatewayName: string) => {
    setCollapsedGateways(prev => ({
      ...prev,
      [gatewayName]: !prev[gatewayName]
    }));
  };

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
      <div className="w-80 border-r border-gray-800/60 bg-[#0a0a0a]/80 backdrop-blur-xl flex flex-col relative z-10">
        <div className="p-5 border-b border-gray-800/60 relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <h2 className="text-xl font-bold font-display text-gray-100 flex items-center gap-2 mb-4 drop-shadow-md">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Code2 className="w-4 h-4 text-blue-400" />
            </div>
            Developer Hub
          </h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-800 text-sm rounded-lg pl-9 pr-4 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all hover:bg-gray-900"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {Object.keys(groupedRoutes).length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              <Box className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No routes found
            </div>
          ) : (
            Object.entries(groupedRoutes).map(([gatewayName, gRoutes]) => {
              const isCollapsed = collapsedGateways[gatewayName];
              return (
                <div key={gatewayName} className="bg-gray-900/20 rounded-xl border border-gray-800/40 p-2 transition-all hover:bg-gray-900/40">
                  <button 
                    onClick={() => toggleGateway(gatewayName)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-200 transition-colors group/header rounded-lg hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-gray-800/80 border border-gray-700/50 flex items-center justify-center group-hover/header:border-blue-500/30 group-hover/header:bg-blue-500/10 transition-colors">
                        <Globe className="w-3.5 h-3.5 text-gray-500 group-hover/header:text-blue-400 transition-colors" />
                      </div>
                      <span className="group-hover/header:text-blue-300 transition-colors">{gatewayName}</span>
                    </div>
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-gray-800/50 group-hover/header:bg-gray-700/50 transition-colors">
                      {isCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover/header:opacity-100 transition-opacity" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover/header:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </button>
                  
                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out px-1",
                    isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100 mt-2"
                  )}>
                    <div className="space-y-1">
                      {gRoutes.map(rt => {
                        const isSelected = selectedRoute?.id === rt.id;
                        return (
                          <button
                            key={rt.id}
                            onClick={() => setSelectedRoute(rt)}
                            className={cn(
                              "group relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                              isSelected 
                                ? "bg-blue-600/10 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                                : "hover:bg-gray-800/40 border border-transparent hover:border-gray-700/50"
                            )}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-lg pointer-events-none" />
                            )}
                            
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center justify-center min-w-[52px] transition-all relative z-10 shrink-0",
                              rt.method === 'GET' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:border-emerald-500/40" :
                              rt.method === 'POST' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:border-blue-500/40" :
                              rt.method === 'PUT' ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:border-orange-500/40" :
                              rt.method === 'DELETE' ? "bg-red-500/10 text-red-400 border border-red-500/20 group-hover:border-red-500/40" :
                              "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 group-hover:border-yellow-500/40"
                            )}>
                              {rt.method}
                            </span>
                            
                            <span className={cn(
                              "text-[12px] font-mono truncate w-full relative z-10 transition-colors",
                              isSelected ? "text-blue-300 font-medium" : "text-gray-400 group-hover:text-gray-200"
                            )}>
                              {rt.path}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Content: Code Viewer */}
      <div className="flex-1 flex flex-col bg-gray-950 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        {selectedRoute ? (
          <>
            <div className="p-6 border-b border-gray-800/60 bg-gradient-to-b from-gray-900/40 to-transparent relative overflow-hidden flex items-center justify-between">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
              
              <div className="flex items-center gap-4">
                <span className={cn(
                  "text-xs font-bold px-3 py-1.5 rounded-md border shrink-0",
                  selectedRoute.method === 'GET' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]" :
                  selectedRoute.method === 'POST' ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]" :
                  selectedRoute.method === 'PUT' ? "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]" :
                  selectedRoute.method === 'DELETE' ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]" :
                  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                )}>
                  {selectedRoute.method}
                </span>
                
                <div className="flex flex-col">
                  <span className="text-gray-500 font-mono text-xs mb-1">Route Path</span>
                  <h1 className="text-xl font-mono text-gray-100 break-all tracking-tight drop-shadow-sm leading-none">
                    {selectedRoute.path}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800/60 shadow-sm shrink-0">
                <Globe className="w-4 h-4 text-blue-400" /> 
                <span className="hidden sm:inline">Gateway:</span> 
                <span className="text-gray-200 font-medium">{selectedRoute.gatewayName}</span>
              </div>
            </div>

            <div className="p-8 flex-1 overflow-y-auto z-10 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2.5 drop-shadow-md">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                      <Terminal className="w-4 h-4 text-purple-400" />
                    </div>
                    Integration Code
                  </h3>
                </div>
                
                <div className="bg-[#0c0d14] border border-gray-800/80 rounded-2xl overflow-hidden shadow-2xl relative group/code transition-all duration-500 hover:border-gray-700/80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover/code:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="flex items-center gap-1 border-b border-gray-800/80 bg-[#12141c] px-3 pt-3">
                    {(['curl', 'python', 'node', 'go'] as const).map((tab) => {
                      const isActive = activeTab === tab;
                      
                      let IconComponent: React.ReactNode;
                      if (tab === 'curl') {
                        IconComponent = <Terminal className={cn("w-4 h-4 relative z-10 transition-colors", isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300")} />;
                      } else if (tab === 'python') {
                        IconComponent = <PythonIcon className={cn("w-4 h-4 relative z-10 transition-all duration-300", isActive ? "" : "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0")} />;
                      } else if (tab === 'node') {
                        IconComponent = <SiNodedotjs className={cn("w-4 h-4 relative z-10 transition-colors", isActive ? "text-[#339933]" : "text-gray-500 group-hover:text-[#339933]/70")} />;
                      } else {
                        IconComponent = <SiGo className={cn("w-4 h-4 relative z-10 transition-colors", isActive ? "text-[#00ADD8]" : "text-gray-500 group-hover:text-[#00ADD8]/70")} />;
                      }

                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={cn(
                            "px-5 py-3 text-sm font-medium border-b-2 transition-all duration-300 relative rounded-t-xl overflow-hidden flex items-center gap-2.5 group",
                            isActive
                              ? "border-blue-500 text-blue-400 bg-blue-500/10"
                              : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                          )}
                        >
                          {isActive && (
                            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,1)]" />
                          )}
                          {IconComponent}
                          <span className="relative z-10 font-mono tracking-wide">{tab === 'node' ? 'Node.js' : tab === 'go' ? 'Go' : tab === 'python' ? 'Python' : 'cURL'}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative p-6 bg-[#0c0d14]">
                    <div className="absolute top-8 right-8 z-10">
                      <button
                        onClick={handleCopy}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 border shadow-lg backdrop-blur-md group/copy",
                          copied 
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                            : "bg-gray-800/60 hover:bg-gray-700/80 border-gray-700/60 text-gray-400 hover:text-gray-200 hover:border-gray-600"
                        )}
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 shrink-0" />
                            <span className="text-xs font-bold tracking-wider">COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 shrink-0 group-hover/copy:scale-110 transition-transform duration-300" />
                            <span className="text-xs font-bold tracking-wider">COPY</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-gray-800/60 shadow-inner text-[13px] bg-[#1a1b26]/50 backdrop-blur-xl">
                      <SyntaxHighlighter
                        language={activeTab === 'curl' ? 'bash' : activeTab === 'node' ? 'javascript' : activeTab}
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: '2rem 1.5rem', background: 'transparent' }}
                        showLineNumbers={true}
                        lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#64748b', textAlign: 'right', borderRight: '1px solid #334155', marginRight: '1em' }}
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
          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-gray-950 to-gray-950 pointer-events-none" />
            <div className="text-center relative z-10 p-8 rounded-2xl bg-gray-900/20 border border-gray-800/40 backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center shadow-inner">
                <RouteIcon className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-300 mb-1">No Route Selected</h3>
              <p className="text-sm text-gray-500 max-w-xs">Select a route from the sidebar to view its integration code and details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
