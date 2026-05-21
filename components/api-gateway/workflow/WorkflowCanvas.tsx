"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  WorkflowGraph,
  WorkflowNodeData,
  NODE_COLORS,
  getCanvasBounds,
} from "./workflow-utils";
import WorkflowNode from "./WorkflowNode";
import WorkflowEdge from "./WorkflowEdge";

interface WorkflowCanvasProps {
  graph: WorkflowGraph;
  onNodeClick?: (node: WorkflowNodeData) => void;
}

export default function WorkflowCanvas({
  graph,
  onNodeClick,
}: WorkflowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  const bounds = getCanvasBounds(graph.nodes);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Center the graph on load/change
  useEffect(() => {
    if (containerSize.w === 0 || graph.nodes.length === 0) return;

    const scaleX = (containerSize.w - 40) / bounds.width;
    const scaleY = (containerSize.h - 40) / bounds.height;
    const scale = Math.min(scaleX, scaleY, 1);

    const scaledW = bounds.width * scale;
    const scaledH = bounds.height * scale;

    setTransform({
      x: (containerSize.w - scaledW) / 2,
      y: (containerSize.h - scaledH) / 2,
      scale,
    });
  }, [containerSize.w, containerSize.h, graph.nodes.length, bounds.width, bounds.height]);

  // Pan handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    },
    [transform.x, transform.y]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom handler
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.92 : 1.08;
      const newScale = Math.min(Math.max(transform.scale * delta, 0.25), 2.5);

      // Zoom towards mouse position
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      setTransform((prev) => ({
        scale: newScale,
        x: mx - (mx - prev.x) * (newScale / prev.scale),
        y: my - (my - prev.y) * (newScale / prev.scale),
      }));
    },
    [transform.scale]
  );

  // Build a node lookup for edges
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-2xl"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(37,99,235,0.03) 0%, transparent 60%), #050810",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.3 }}
      >
        <defs>
          <pattern
            id="grid-pattern"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="15" cy="15" r="0.5" fill="#1E293B" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* Main SVG canvas */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* CSS animations */}
        <defs>
          <style>{`
            @keyframes dashFlow {
              to { stroke-dashoffset: -28; }
            }
            @keyframes edgeFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes statusPulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.4; }
            }
            .workflow-node-bg {
              transition: all 0.2s ease;
            }
            .workflow-node-bg:hover {
              fill: #0F172A;
              stroke-opacity: 0.6;
            }
          `}</style>

          {/* Glow filters for each node type */}
          {Object.entries(NODE_COLORS).map(([type, c]) => (
            <filter
              key={type}
              id={`node-glow-${type}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="8"
                result="blur"
              />
              <feFlood floodColor={c.glow} result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        <g
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
        >
          {/* Render edges first (behind nodes) */}
          {graph.edges.map((edge, i) => {
            const src = nodeMap.get(edge.sourceId);
            const tgt = nodeMap.get(edge.targetId);
            if (!src || !tgt) return null;
            return (
              <WorkflowEdge
                key={edge.id}
                edge={edge}
                sourceNode={src}
                targetNode={tgt}
                index={i}
              />
            );
          })}

          {/* Render nodes on top */}
          {graph.nodes.map((node, i) => (
            <WorkflowNode
              key={node.id}
              node={node}
              index={i}
              onClick={onNodeClick}
            />
          ))}
        </g>
      </svg>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <button
          onClick={() =>
            setTransform((prev) => ({
              ...prev,
              scale: Math.min(prev.scale * 1.2, 2.5),
            }))
          }
          className="w-8 h-8 rounded-lg bg-[#0B101B] border border-white/10 text-white/60 hover:text-white hover:border-white/20 flex items-center justify-center text-sm font-bold transition-all"
        >
          +
        </button>
        <span className="text-[10px] font-mono text-white/40 min-w-[40px] text-center">
          {Math.round(transform.scale * 100)}%
        </span>
        <button
          onClick={() =>
            setTransform((prev) => ({
              ...prev,
              scale: Math.max(prev.scale / 1.2, 0.25),
            }))
          }
          className="w-8 h-8 rounded-lg bg-[#0B101B] border border-white/10 text-white/60 hover:text-white hover:border-white/20 flex items-center justify-center text-sm font-bold transition-all"
        >
          −
        </button>
        <button
          onClick={() => {
            if (containerSize.w === 0) return;
            const scaleX = (containerSize.w - 40) / bounds.width;
            const scaleY = (containerSize.h - 40) / bounds.height;
            const scale = Math.min(scaleX, scaleY, 1);
            const scaledW = bounds.width * scale;
            const scaledH = bounds.height * scale;
            setTransform({
              x: (containerSize.w - scaledW) / 2,
              y: (containerSize.h - scaledH) / 2,
              scale,
            });
          }}
          className="w-8 h-8 rounded-lg bg-[#0B101B] border border-white/10 text-white/60 hover:text-white hover:border-white/20 flex items-center justify-center text-[9px] font-bold transition-all"
          title="Fit to view"
        >
          ⊞
        </button>
      </div>

      {/* Minimap */}
      <div className="absolute bottom-4 left-4 w-40 h-28 bg-[#0B101B]/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl z-10 pointer-events-none">
        <svg
          viewBox={`0 0 ${Math.max(1000, bounds.width + 600)} ${Math.max(600, bounds.height + 600)}`}
          className="w-full h-full p-2"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Nodes */}
          {graph.nodes.map((n) => (
            <rect
              key={n.id}
              x={n.x}
              y={n.y}
              width={240}
              height={80}
              rx="20"
              fill={NODE_COLORS[n.type].border}
              opacity="0.8"
            />
          ))}
          {/* Viewport */}
          {containerSize.w > 0 && (
            <rect
              x={-transform.x / transform.scale}
              y={-transform.y / transform.scale}
              width={containerSize.w / transform.scale}
              height={containerSize.h / transform.scale}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3B82F6"
              strokeWidth={Math.max(20, bounds.width / 40)}
              rx="30"
              className="transition-all duration-75"
            />
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 flex flex-wrap gap-3 bg-[#0B101B]/80 backdrop-blur-sm border border-white/5 rounded-xl px-4 py-3">
        {Object.entries(NODE_COLORS).map(([type, c]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: c.border,
                boxShadow: `0 0 6px ${c.glow}`,
              }}
            />
            <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">
              {type === "serviceTarget" ? "Target" : type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
