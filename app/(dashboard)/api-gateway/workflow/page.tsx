"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Workflow, Globe, Loader2, ChevronDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  apiClient,
  Gateway,
  Service,
  ServiceTarget,
  GatewayRoute,
  GatewayPlugin,
} from "@/lib/api-client";
import WorkflowCanvas from "@/components/api-gateway/workflow/WorkflowCanvas";
import {
  buildWorkflowGraph,
  WorkflowNodeData,
} from "@/components/api-gateway/workflow/workflow-utils";
import { useRouter } from "next/navigation";

export default function WorkflowViewPage() {
  const router = useRouter();

  // Data state
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceTargets, setServiceTargets] = useState<ServiceTarget[]>([]);
  const [routes, setRoutes] = useState<GatewayRoute[]>([]);
  const [plugins, setPlugins] = useState<GatewayPlugin[]>([]);

  // UI state
  const [selectedGatewayId, setSelectedGatewayId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch all data
  const fetchAllData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [gw, svc, st, rt, pl] = await Promise.all([
        apiClient.gateways.getAll(),
        apiClient.services.getAll(),
        apiClient.serviceTargets.getAll(),
        apiClient.gatewayRoutes.getAll(),
        apiClient.gatewayPlugins.getAll(),
      ]);

      setGateways(gw);
      setServices(svc);
      setServiceTargets(st);
      setRoutes(rt);
      setPlugins(pl);

      // Auto-select first gateway if none selected
      if (!selectedGatewayId && gw.length > 0) {
        setSelectedGatewayId(gw[0].id || null);
      }
    } catch (error) {
      console.error("Failed to fetch workflow data", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build graph for selected gateway
  const selectedGateway = useMemo(
    () => gateways.find((g) => g.id === selectedGatewayId),
    [gateways, selectedGatewayId]
  );

  const graph = useMemo(() => {
    if (!selectedGateway) return null;
    return buildWorkflowGraph(
      selectedGateway,
      services,
      serviceTargets,
      routes,
      plugins
    );
  }, [selectedGateway, services, serviceTargets, routes, plugins]);

  // Count entities for the selected gateway
  const entityCounts = useMemo(() => {
    if (!selectedGatewayId) return { services: 0, targets: 0, routes: 0, plugins: 0 };
    return {
      services: services.filter((s) => s.gateway_id === selectedGatewayId).length,
      targets: serviceTargets.filter((t) =>
        services.some(
          (s) => s.id === t.service_id && s.gateway_id === selectedGatewayId
        )
      ).length,
      routes: routes.filter((r) => r.gateway_id === selectedGatewayId).length,
      plugins: plugins.filter((p) => p.gateway_id === selectedGatewayId).length,
    };
  }, [selectedGatewayId, services, serviceTargets, routes, plugins]);

  // Handle node click → navigate to detail page
  const handleNodeClick = (node: WorkflowNodeData) => {
    const data = node.data;
    switch (node.type) {
      case "gateway":
        if (data.id) router.push(`/api-gateway/${data.id}`);
        break;
      case "service":
        if (data.gateway_id)
          router.push(`/api-gateway/${data.gateway_id}/services`);
        break;
      case "serviceTarget":
        router.push(`/api-gateway/service-targets`);
        break;
      case "route":
        if (data.gateway_id)
          router.push(`/api-gateway/${data.gateway_id}/routes`);
        break;
      case "plugin":
        if (data.gateway_id)
          router.push(`/api-gateway/${data.gateway_id}/plugins`);
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center animate-pulse">
            <Workflow className="w-8 h-8 text-blue-500/40" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            <p className="text-[11px] font-black text-white uppercase tracking-widest">
              Loading Workflow Graph...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <div className="w-8 h-[2px] bg-blue-500" />
            Visual Orchestration
          </div>
          <h2 className="text-3xl font-black font-display text-white tracking-tight">
            Workflow View
          </h2>
          <p className="text-[13px] text-[#64748B] mt-1.5 font-medium">
            Visualize your gateway infrastructure as an interactive node graph.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Gateway selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "flex items-center gap-3 bg-[#0B101B] hover:bg-[#0F172A] text-white pl-4 pr-3 py-2.5 rounded-xl text-sm font-medium transition-all border border-white/5 shadow-xl min-w-[220px]",
                isDropdownOpen && "border-blue-500/30"
              )}
            >
              <Globe className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="flex-1 text-left truncate">
                {selectedGateway?.name || "Select Gateway"}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-[#64748B] transition-transform",
                  isDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-full bg-[#0B101B] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                {gateways.map((gw) => (
                  <button
                    key={gw.id}
                    onClick={() => {
                      setSelectedGatewayId(gw.id || null);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-all",
                      gw.id === selectedGatewayId
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-[#94A3B8] hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        gw.is_active ? "bg-emerald-400" : "bg-red-500"
                      )}
                    />
                    <span className="font-medium truncate">{gw.name}</span>
                  </button>
                ))}
                {gateways.length === 0 && (
                  <div className="px-4 py-3 text-[#64748B] text-sm">
                    No gateways found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Refresh button */}
          <button
            onClick={() => fetchAllData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 shadow-xl active:scale-95"
          >
            <RefreshCw
              className={cn(
                "w-3.5 h-3.5 text-[#64748B]",
                isRefreshing && "animate-spin"
              )}
            />
            {isRefreshing ? "Syncing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Entity counts */}
      {selectedGateway && (
        <div className="flex items-center gap-4 mb-4">
          {[
            { label: "Services", count: entityCounts.services, color: "#06B6D4" },
            { label: "Targets", count: entityCounts.targets, color: "#10B981" },
            { label: "Routes", count: entityCounts.routes, color: "#8B5CF6" },
            { label: "Plugins", count: entityCounts.plugins, color: "#EC4899" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 bg-[#0B101B] border border-white/5 rounded-lg px-3 py-1.5"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: item.color,
                  boxShadow: `0 0 6px ${item.color}40`,
                }}
              />
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                {item.label}
              </span>
              <span
                className="text-[11px] font-black"
                style={{ color: item.color }}
              >
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Canvas area */}
      <div className="flex-1 bg-[#0B101B] border border-white/5 rounded-[1.5rem] overflow-hidden shadow-2xl relative">
        {graph && graph.nodes.length > 0 ? (
          <WorkflowCanvas graph={graph} onNodeClick={handleNodeClick} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                <Workflow className="w-10 h-10 text-[#1E293B]" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black text-white uppercase tracking-widest">
                  {gateways.length === 0
                    ? "No Gateways Found"
                    : "Empty Gateway"}
                </p>
                <p className="text-[10px] text-[#64748B] mt-2 font-medium uppercase tracking-wider max-w-[300px]">
                  {gateways.length === 0
                    ? "Create a gateway first to see its workflow visualization."
                    : "This gateway has no services, routes, or plugins configured yet."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Close dropdown on outside click */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
