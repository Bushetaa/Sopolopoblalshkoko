import {
  Gateway,
  Service,
  ServiceTarget,
  GatewayRoute,
  GatewayPlugin,
} from "@/lib/api-client";

// ─── Types ──────────────────────────────────────────────────────────

export type NodeType =
  | "gateway"
  | "service"
  | "serviceTarget"
  | "route"
  | "plugin";

export interface WorkflowNodeData {
  id: string;
  type: NodeType;
  label: string;
  subtitle: string;
  status: "active" | "idle" | "error";
  x: number;
  y: number;
  data: Record<string, any>;
}

export interface WorkflowEdgeData {
  id: string;
  sourceId: string;
  targetId: string;
  sourceType: NodeType;
  targetType: NodeType;
}

export interface WorkflowGraph {
  nodes: WorkflowNodeData[];
  edges: WorkflowEdgeData[];
}

// ─── Constants ──────────────────────────────────────────────────────

export const NODE_WIDTH = 240;
export const NODE_HEIGHT = 100;
export const COLUMN_GAP = 260;
export const ROW_GAP = 40;
export const CANVAS_PADDING = 80;

export const NODE_COLORS: Record<
  NodeType,
  { glow: string; border: string; icon: string; bg: string }
> = {
  gateway: {
    glow: "rgba(37, 99, 235, 0.4)",
    border: "#2563EB",
    icon: "#60A5FA",
    bg: "rgba(37, 99, 235, 0.08)",
  },
  service: {
    glow: "rgba(6, 182, 212, 0.4)",
    border: "#06B6D4",
    icon: "#22D3EE",
    bg: "rgba(6, 182, 212, 0.08)",
  },
  serviceTarget: {
    glow: "rgba(16, 185, 129, 0.4)",
    border: "#10B981",
    icon: "#34D399",
    bg: "rgba(16, 185, 129, 0.08)",
  },
  route: {
    glow: "rgba(139, 92, 246, 0.4)",
    border: "#8B5CF6",
    icon: "#A78BFA",
    bg: "rgba(139, 92, 246, 0.08)",
  },
  plugin: {
    glow: "rgba(236, 72, 153, 0.4)",
    border: "#EC4899",
    icon: "#F472B6",
    bg: "rgba(236, 72, 153, 0.08)",
  },
};

export const STATUS_COLORS: Record<string, string> = {
  active: "#10B981",
  idle: "#F59E0B",
  error: "#EF4444",
};

// ─── Graph Builder ──────────────────────────────────────────────────

export function buildWorkflowGraph(
  gateway: Gateway,
  services: Service[],
  serviceTargets: ServiceTarget[],
  routes: GatewayRoute[],
  plugins: GatewayPlugin[]
): WorkflowGraph {
  const nodes: WorkflowNodeData[] = [];
  const edges: WorkflowEdgeData[] = [];

  // Filter to this gateway
  const gwServices = services.filter((s) => s.gateway_id === gateway.id);
  const gwRoutes = routes.filter((r) => r.gateway_id === gateway.id);
  const gwPlugins = plugins.filter((p) => p.gateway_id === gateway.id);

  // 1) Gateway node
  const gwNodeId = `gw-${gateway.id}`;
  nodes.push({
    id: gwNodeId,
    type: "gateway",
    label: gateway.name,
    subtitle: gateway.is_active ? "Active Gateway" : "Inactive Gateway",
    status: gateway.is_active ? "active" : "error",
    x: 0,
    y: 0,
    data: gateway,
  });

  // 2) Service nodes
  gwServices.forEach((svc) => {
    const svcNodeId = `svc-${svc.id}`;
    nodes.push({
      id: svcNodeId,
      type: "service",
      label: svc.name,
      subtitle: `${svc.protocol?.toUpperCase() || "HTTP"} · ${svc.lb_policy || "round-robin"}`,
      status: "active",
      x: 0,
      y: 0,
      data: svc,
    });
    edges.push({
      id: `e-${gwNodeId}-${svcNodeId}`,
      sourceId: gwNodeId,
      targetId: svcNodeId,
      sourceType: "gateway",
      targetType: "service",
    });

    // 3) Service Targets for this service
    const svcTargets = serviceTargets.filter((t) => t.service_id === svc.id);
    svcTargets.forEach((target) => {
      const targetNodeId = `st-${target.id}`;
      nodes.push({
        id: targetNodeId,
        type: "serviceTarget",
        label: truncateUrl(target.url),
        subtitle: `Weight: ${target.weight ?? 1}`,
        status: "active",
        x: 0,
        y: 0,
        data: target,
      });
      edges.push({
        id: `e-${svcNodeId}-${targetNodeId}`,
        sourceId: svcNodeId,
        targetId: targetNodeId,
        sourceType: "service",
        targetType: "serviceTarget",
      });
    });
  });

  // 4) Route nodes — group by service
  gwRoutes.forEach((route) => {
    const routeNodeId = `rt-${route.id}`;
    nodes.push({
      id: routeNodeId,
      type: "route",
      label: route.path,
      subtitle: `${route.method} ${route.is_aggregate ? "· Aggregate" : ""}`.trim(),
      status: "active",
      x: 0,
      y: 0,
      data: route,
    });

    // Edge: route → service (if linked)
    if (route.service_id) {
      const svcNodeId = `svc-${route.service_id}`;
      if (nodes.find((n) => n.id === svcNodeId)) {
        edges.push({
          id: `e-${routeNodeId}-${svcNodeId}`,
          sourceId: routeNodeId,
          targetId: svcNodeId,
          sourceType: "route",
          targetType: "service",
        });
      }
    }

    // Edge: gateway → route
    edges.push({
      id: `e-${gwNodeId}-${routeNodeId}`,
      sourceId: gwNodeId,
      targetId: routeNodeId,
      sourceType: "gateway",
      targetType: "route",
    });

    // 5) Plugins attached to this route
    const routePlugins = gwPlugins.filter((p) => p.route_id === route.id);
    routePlugins.forEach((plugin) => {
      const pluginNodeId = `pl-${plugin.id}`;
      // Avoid duplicate plugin nodes
      if (!nodes.find((n) => n.id === pluginNodeId)) {
        nodes.push({
          id: pluginNodeId,
          type: "plugin",
          label: plugin.name,
          subtitle: `Route Plugin • Phase: ${plugin.phase}`,
          status: plugin.enabled !== false && plugin.is_enabled !== false ? "active" : "idle",
          x: 0,
          y: 0,
          data: plugin,
        });
      }
      edges.push({
        id: `e-${routeNodeId}-${pluginNodeId}`,
        sourceId: routeNodeId,
        targetId: pluginNodeId,
        sourceType: "route",
        targetType: "plugin",
      });
    });
  });

  // Plugins attached directly to services (not via route)
  gwPlugins
    .filter((p) => p.service_id && !p.route_id)
    .forEach((plugin) => {
      const pluginNodeId = `pl-${plugin.id}`;
      if (!nodes.find((n) => n.id === pluginNodeId)) {
        nodes.push({
          id: pluginNodeId,
          type: "plugin",
          label: plugin.name,
          subtitle: `Service Plugin • Phase: ${plugin.phase}`,
          status: plugin.enabled !== false && plugin.is_enabled !== false ? "active" : "idle",
          x: 0,
          y: 0,
          data: plugin,
        });
      }
      const svcNodeId = `svc-${plugin.service_id}`;
      if (nodes.find((n) => n.id === svcNodeId)) {
        edges.push({
          id: `e-${svcNodeId}-${pluginNodeId}`,
          sourceId: svcNodeId,
          targetId: pluginNodeId,
          sourceType: "service",
          targetType: "plugin",
        });
      }
    });

  // Plugins attached to gateway directly
  gwPlugins
    .filter((p) => !p.service_id && !p.route_id)
    .forEach((plugin) => {
      const pluginNodeId = `pl-${plugin.id}`;
      if (!nodes.find((n) => n.id === pluginNodeId)) {
        nodes.push({
          id: pluginNodeId,
          type: "plugin",
          label: plugin.name,
          subtitle: `Gateway Plugin • Phase: ${plugin.phase}`,
          status: plugin.enabled !== false && plugin.is_enabled !== false ? "active" : "idle",
          x: 0,
          y: 0,
          data: plugin,
        });
        edges.push({
          id: `e-${gwNodeId}-${pluginNodeId}`,
          sourceId: gwNodeId,
          targetId: pluginNodeId,
          sourceType: "gateway",
          targetType: "plugin",
        });
      }
    });

  // Compute layout positions using hierarchical algorithm
  computeHierarchicalLayout(nodes, edges);

  return { nodes, edges };
}

// ─── Hierarchical Layout Algorithm ──────────────────────────────────

/**
 * Relationship-aware layout:
 * 
 *   Col 0: Gateway (center)
 *   Col 1: Services (children of gateway, vertically stacked)
 *   Col 2: Per service → routes (grouped under their service) + service targets
 *   Col 3: Plugins (placed near their parent route/service)
 * 
 * Routes are grouped by the service they connect to, so lines don't cross.
 * Orphan routes (no service_id) get their own group.
 * Gateway-level plugins are placed below the gateway.
 */
function computeHierarchicalLayout(
  nodes: WorkflowNodeData[],
  edges: WorkflowEdgeData[]
) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Build adjacency: for each node, which nodes does it connect TO (targets)
  const childrenOf = new Map<string, string[]>();
  for (const e of edges) {
    const list = childrenOf.get(e.sourceId) || [];
    list.push(e.targetId);
    childrenOf.set(e.sourceId, list);
  }

  // Find gateway node
  const gwNode = nodes.find((n) => n.type === "gateway");
  if (!gwNode) return;

  // Get services connected to gateway
  const serviceIds = (childrenOf.get(gwNode.id) || []).filter((id) =>
    nodeMap.get(id)?.type === "service"
  );

  // Get routes connected to gateway
  const routeIds = (childrenOf.get(gwNode.id) || []).filter((id) =>
    nodeMap.get(id)?.type === "route"
  );

  // Get gateway-level plugins
  const gwPluginIds = (childrenOf.get(gwNode.id) || []).filter((id) =>
    nodeMap.get(id)?.type === "plugin"
  );

  // Group routes by the service they connect to
  const routesByService = new Map<string, string[]>(); // serviceId → routeIds
  const orphanRoutes: string[] = [];

  for (const routeId of routeIds) {
    const routeChildren = childrenOf.get(routeId) || [];
    const linkedServiceId = routeChildren.find((cId) =>
      nodeMap.get(cId)?.type === "service"
    );
    if (linkedServiceId) {
      const list = routesByService.get(linkedServiceId) || [];
      list.push(routeId);
      routesByService.set(linkedServiceId, list);
    } else {
      orphanRoutes.push(routeId);
    }
  }

  // For each route, find its plugins
  const pluginsByParent = new Map<string, string[]>();
  for (const routeId of routeIds) {
    const routeChildren = childrenOf.get(routeId) || [];
    const pluginIds = routeChildren.filter((cId) =>
      nodeMap.get(cId)?.type === "plugin"
    );
    if (pluginIds.length > 0) {
      pluginsByParent.set(routeId, pluginIds);
    }
  }

  // For each service, find its service targets and direct plugins
  const targetsByService = new Map<string, string[]>();
  const pluginsByService = new Map<string, string[]>();
  for (const svcId of serviceIds) {
    const svcChildren = childrenOf.get(svcId) || [];
    targetsByService.set(
      svcId,
      svcChildren.filter((cId) => nodeMap.get(cId)?.type === "serviceTarget")
    );
    pluginsByService.set(
      svcId,
      svcChildren.filter((cId) => nodeMap.get(cId)?.type === "plugin")
    );
  }

  // ─── Now position everything ───────────────────────────────────────
  // Strategy: Build "swim lanes" per service. Each service gets a horizontal
  // band containing its routes (col 1), the service itself (col 2),
  // its service targets (col 3), and plugins (col 4).

  const COL_X = [
    CANVAS_PADDING,                                      // Col 0: Gateway
    CANVAS_PADDING + (NODE_WIDTH + COLUMN_GAP),          // Col 1: Routes
    CANVAS_PADDING + (NODE_WIDTH + COLUMN_GAP) * 2,      // Col 2: Services
    CANVAS_PADDING + (NODE_WIDTH + COLUMN_GAP) * 3,      // Col 3: Service Targets
    CANVAS_PADDING + (NODE_WIDTH + COLUMN_GAP) * 4,      // Col 4: Plugins
  ];

  let currentY = CANVAS_PADDING;
  const SERVICE_BAND_GAP = 60; // Vertical gap between service groups
  const serviceBandCenters: number[] = [];

  // Process each service as a "band"
  for (const svcId of serviceIds) {
    const svcNode = nodeMap.get(svcId);
    if (!svcNode) continue;

    const svcRoutes = routesByService.get(svcId) || [];
    const svcTargets = targetsByService.get(svcId) || [];
    const svcPlugins = pluginsByService.get(svcId) || [];

    // Collect all route-level plugins for this service's routes
    const allRoutePlugins: string[] = [];
    for (const rId of svcRoutes) {
      const rp = pluginsByParent.get(rId) || [];
      allRoutePlugins.push(...rp);
    }

    // The band height is determined by the tallest column in this group
    const col1Count = svcRoutes.length;
    const col3Count = svcTargets.length;
    const col4Count = svcPlugins.length + allRoutePlugins.length;
    const maxRows = Math.max(1, col1Count, col3Count, col4Count);
    const bandHeight = maxRows * (NODE_HEIGHT + ROW_GAP) - ROW_GAP;

    // Position routes (col 1) — vertically centered within band
    const routeBlockH = col1Count * (NODE_HEIGHT + ROW_GAP) - (col1Count > 0 ? ROW_GAP : 0);
    const routeStartY = currentY + (bandHeight - routeBlockH) / 2;
    svcRoutes.forEach((rId, i) => {
      const rNode = nodeMap.get(rId);
      if (rNode) {
        rNode.x = COL_X[1];
        rNode.y = routeStartY + i * (NODE_HEIGHT + ROW_GAP);
      }
    });

    // Position service (col 2) — centered vertically within band
    svcNode.x = COL_X[2];
    svcNode.y = currentY + (bandHeight - NODE_HEIGHT) / 2;

    // Position service targets (col 3) — centered vertically within band
    const targetBlockH = col3Count * (NODE_HEIGHT + ROW_GAP) - (col3Count > 0 ? ROW_GAP : 0);
    const targetStartY = currentY + (bandHeight - targetBlockH) / 2;
    svcTargets.forEach((tId, i) => {
      const tNode = nodeMap.get(tId);
      if (tNode) {
        tNode.x = COL_X[3];
        tNode.y = targetStartY + i * (NODE_HEIGHT + ROW_GAP);
      }
    });

    // Position plugins (col 4) — service-level first, then route-level
    const allPluginsForCol4 = [...svcPlugins, ...allRoutePlugins];
    // Deduplicate
    const uniquePlugins = [...new Set(allPluginsForCol4)];
    const pluginBlockH = uniquePlugins.length * (NODE_HEIGHT + ROW_GAP) - (uniquePlugins.length > 0 ? ROW_GAP : 0);
    const pluginStartY = currentY + (bandHeight - pluginBlockH) / 2;
    uniquePlugins.forEach((pId, i) => {
      const pNode = nodeMap.get(pId);
      if (pNode) {
        pNode.x = COL_X[4];
        pNode.y = pluginStartY + i * (NODE_HEIGHT + ROW_GAP);
      }
    });

    serviceBandCenters.push(currentY + bandHeight / 2);
    currentY += bandHeight + SERVICE_BAND_GAP;
  }

  // Position orphan routes (routes not linked to any service)
  if (orphanRoutes.length > 0) {
    const orphanBlockH = orphanRoutes.length * (NODE_HEIGHT + ROW_GAP) - ROW_GAP;
    const orphanStartY = currentY;
    orphanRoutes.forEach((rId, i) => {
      const rNode = nodeMap.get(rId);
      if (rNode) {
        rNode.x = COL_X[1];
        rNode.y = orphanStartY + i * (NODE_HEIGHT + ROW_GAP);
      }
    });

    // Orphan route plugins
    for (const rId of orphanRoutes) {
      const rp = pluginsByParent.get(rId) || [];
      rp.forEach((pId, i) => {
        const pNode = nodeMap.get(pId);
        if (pNode && pNode.x === 0 && pNode.y === 0) {
          const rNode = nodeMap.get(rId);
          pNode.x = COL_X[2]; // Put plugins in col 2 for orphan routes
          pNode.y = (rNode?.y || orphanStartY) + i * (NODE_HEIGHT + ROW_GAP);
        }
      });
    }

    currentY += orphanBlockH + SERVICE_BAND_GAP;
  }

  // Position gateway (col 0) — vertically centered relative to all content
  const totalContentHeight = currentY - SERVICE_BAND_GAP - CANVAS_PADDING;
  
  // Account for gateway plugins in the gateway block height
  const gwTotalNodes = 1 + gwPluginIds.length;
  const gwBlockHeight = gwTotalNodes * (NODE_HEIGHT + ROW_GAP) - ROW_GAP;
  
  // Vertically center the entire gateway block
  const gwStartY = CANVAS_PADDING + Math.max(0, (totalContentHeight - gwBlockHeight) / 2);
  
  gwNode.x = COL_X[0];
  gwNode.y = gwStartY;

  // Position gateway-level plugins directly below the gateway in the same column
  if (gwPluginIds.length > 0) {
    gwPluginIds.forEach((pId, i) => {
      const pNode = nodeMap.get(pId);
      if (pNode) {
        pNode.x = COL_X[0];
        pNode.y = gwStartY + (i + 1) * (NODE_HEIGHT + ROW_GAP);
      }
    });
  }
}

// ─── Helpers ────────────────────────────────────────────────────────

function truncateUrl(url: string, maxLen = 28): string {
  if (!url) return "Unknown";
  try {
    const u = new URL(url);
    const display = u.hostname + (u.port ? `:${u.port}` : "");
    return display.length > maxLen ? display.substring(0, maxLen) + "…" : display;
  } catch {
    return url.length > maxLen ? url.substring(0, maxLen) + "…" : url;
  }
}

/**
 * Computes a bezier curve path between two node connection ports.
 * Source port is on the right edge (or left if going backward),
 * Target port is on the left edge (or right if going backward).
 */
export function getEdgePath(
  sourceNode: WorkflowNodeData,
  targetNode: WorkflowNodeData
): string {
  // If they are in the exact same column, draw an orthogonal bracket on the left side
  if (sourceNode.x === targetNode.x) {
    const sx = sourceNode.x;
    const sy = sourceNode.y + NODE_HEIGHT / 2;
    const tx = targetNode.x;
    const ty = targetNode.y + NODE_HEIGHT / 2;
    const offset = 32; // Rigid bracket offset to the left
    return `M ${sx} ${sy} L ${sx - offset} ${sy} L ${tx - offset} ${ty} L ${tx} ${ty}`;
  }

  const isForward = targetNode.x > sourceNode.x;

  const sx = isForward ? sourceNode.x + NODE_WIDTH : sourceNode.x;
  const sy = sourceNode.y + NODE_HEIGHT / 2;
  const tx = isForward ? targetNode.x : targetNode.x + NODE_WIDTH;
  const ty = targetNode.y + NODE_HEIGHT / 2;

  const dx = Math.abs(tx - sx);
  const dy = Math.abs(ty - sy);

  // If going backwards, we want the curve to loop out
  const cpOffset = isForward ? Math.max(dx * 0.5, 60) : Math.max(dx * 0.8, dy * 0.8, 100);

  const cp1x = isForward ? sx + cpOffset : sx - cpOffset;
  const cp2x = isForward ? tx - cpOffset : tx + cpOffset;

  return `M ${sx} ${sy} C ${cp1x} ${sy}, ${cp2x} ${ty}, ${tx} ${ty}`;
}

/**
 * Returns total canvas dimensions based on node positions.
 */
export function getCanvasBounds(nodes: WorkflowNodeData[]): {
  width: number;
  height: number;
} {
  if (nodes.length === 0) return { width: 800, height: 500 };

  let maxX = 0;
  let maxY = 0;
  for (const n of nodes) {
    if (n.x + NODE_WIDTH > maxX) maxX = n.x + NODE_WIDTH;
    if (n.y + NODE_HEIGHT > maxY) maxY = n.y + NODE_HEIGHT;
  }

  return {
    width: maxX + CANVAS_PADDING * 2,
    height: maxY + CANVAS_PADDING * 2,
  };
}
