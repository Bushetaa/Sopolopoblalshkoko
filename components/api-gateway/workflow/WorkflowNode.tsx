"use client";

import React from "react";
import { Globe, Server, Target, Route, Plug } from "lucide-react";
import { motion } from "framer-motion";
import {
  WorkflowNodeData,
  NodeType,
  NODE_WIDTH,
  NODE_HEIGHT,
  NODE_COLORS,
  STATUS_COLORS,
} from "./workflow-utils";

const ICONS: Record<NodeType, React.ElementType> = {
  gateway: Globe,
  service: Server,
  serviceTarget: Target,
  route: Route,
  plugin: Plug,
};

const TYPE_LABELS: Record<NodeType, string> = {
  gateway: "Gateway",
  service: "Service",
  serviceTarget: "Target",
  route: "Route",
  plugin: "Plugin",
};

interface WorkflowNodeProps {
  node: WorkflowNodeData;
  index: number;
  onClick?: (node: WorkflowNodeData) => void;
}

export default function WorkflowNode({
  node,
  index,
  onClick,
}: WorkflowNodeProps) {
  const Icon = ICONS[node.type];
  const colors = NODE_COLORS[node.type];
  const statusColor = STATUS_COLORS[node.status];

  return (
    <motion.g
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ cursor: "pointer" }}
      onClick={() => onClick?.(node)}
    >
      {/* Shape Background & Glow */}
      {(() => {
        if (node.type === "gateway") {
          const hexPoints = `
            ${node.x + 20},${node.y}
            ${node.x + NODE_WIDTH - 20},${node.y}
            ${node.x + NODE_WIDTH},${node.y + NODE_HEIGHT / 2}
            ${node.x + NODE_WIDTH - 20},${node.y + NODE_HEIGHT}
            ${node.x + 20},${node.y + NODE_HEIGHT}
            ${node.x},${node.y + NODE_HEIGHT / 2}
          `;
          const hexGlowPoints = `
            ${node.x + 20 - 2},${node.y - 4}
            ${node.x + NODE_WIDTH - 20 + 2},${node.y - 4}
            ${node.x + NODE_WIDTH + 4},${node.y + NODE_HEIGHT / 2}
            ${node.x + NODE_WIDTH - 20 + 2},${node.y + NODE_HEIGHT + 4}
            ${node.x + 20 - 2},${node.y + NODE_HEIGHT + 4}
            ${node.x - 4},${node.y + NODE_HEIGHT / 2}
          `;
          return (
            <>
              <polygon
                points={hexGlowPoints}
                fill="none"
                stroke={colors.border}
                strokeWidth="1"
                strokeOpacity="0.15"
                filter={`url(#node-glow-${node.type})`}
              />
              <polygon
                points={hexPoints}
                fill="#0B101B"
                stroke={colors.border}
                strokeWidth="1"
                strokeOpacity="0.3"
                className="workflow-node-bg"
              />
            </>
          );
        }

        const rx = node.type === "plugin" ? NODE_HEIGHT / 2 : 16;
        const isTarget = node.type === "serviceTarget";

        return (
          <>
            <rect
              x={node.x - 4}
              y={node.y - 4}
              width={NODE_WIDTH + 8}
              height={NODE_HEIGHT + 8}
              rx={rx === NODE_HEIGHT / 2 ? rx + 4 : 20}
              fill="none"
              stroke={colors.border}
              strokeWidth="1"
              strokeOpacity="0.15"
              filter={`url(#node-glow-${node.type})`}
            />
            <rect
              x={node.x}
              y={node.y}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx={rx}
              fill="#0B101B"
              stroke={colors.border}
              strokeWidth="1"
              strokeOpacity="0.3"
              strokeDasharray={isTarget ? "6 4" : "none"}
              className="workflow-node-bg"
            />
          </>
        );
      })()}

      {/* Top highlight line */}
      {node.type !== "gateway" && node.type !== "plugin" && (
        <rect
          x={node.x + 16}
          y={node.y}
          width={NODE_WIDTH - 32}
          height={2}
          rx={1}
          fill={colors.border}
          opacity={0.4}
        />
      )}

      {/* Icon background circle */}
      <rect
        x={node.x + 16}
        y={node.y + 20}
        width={36}
        height={36}
        rx={10}
        fill={colors.bg}
        stroke={colors.border}
        strokeWidth="1"
        strokeOpacity="0.3"
      />

      {/* Icon */}
      <foreignObject
        x={node.x + 16}
        y={node.y + 20}
        width={36}
        height={36}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            style={{
              width: 18,
              height: 18,
              color: colors.icon,
              strokeWidth: 2.5,
            }}
          />
        </div>
      </foreignObject>

      {/* Title */}
      <foreignObject
        x={node.x + 62}
        y={node.y + 18}
        width={NODE_WIDTH - 82}
        height={22}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 800,
            color: "#F1F5F9",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: "22px",
            fontFamily: "inherit",
          }}
          title={node.label}
        >
          {node.label}
        </div>
      </foreignObject>

      {/* Subtitle */}
      <foreignObject
        x={node.x + 62}
        y={node.y + 40}
        width={NODE_WIDTH - 82}
        height={18}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 600,
            color: "#64748B",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: "18px",
            fontFamily: "inherit",
          }}
        >
          {node.subtitle}
        </div>
      </foreignObject>

      {/* Bottom status bar */}
      <foreignObject
        x={node.x + 16}
        y={node.y + NODE_HEIGHT - 28}
        width={NODE_WIDTH - 32}
        height={20}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "9px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontFamily: "inherit",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: statusColor,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: statusColor,
                display: "inline-block",
                boxShadow: `0 0 6px ${statusColor}`,
                animation:
                  node.status === "active"
                    ? "statusPulse 2s ease-in-out infinite"
                    : "none",
              }}
            />
            {node.status === "active"
              ? "ACTIVE"
              : node.status === "idle"
                ? "IDLE"
                : "OFFLINE"}
          </span>
          <span style={{ color: "#475569" }}>
            {TYPE_LABELS[node.type].toLowerCase()}
          </span>
        </div>
      </foreignObject>

      {/* Right connection port */}
      <circle
        cx={node.x + NODE_WIDTH}
        cy={node.y + NODE_HEIGHT / 2}
        r={5}
        fill="#0B101B"
        stroke={colors.border}
        strokeWidth={2}
        strokeOpacity={0.5}
      />
      <circle
        cx={node.x + NODE_WIDTH}
        cy={node.y + NODE_HEIGHT / 2}
        r={2}
        fill={colors.border}
        opacity={0.7}
      />

      {/* Left connection port */}
      <circle
        cx={node.x}
        cy={node.y + NODE_HEIGHT / 2}
        r={5}
        fill="#0B101B"
        stroke={colors.border}
        strokeWidth={2}
        strokeOpacity={0.5}
      />
      <circle
        cx={node.x}
        cy={node.y + NODE_HEIGHT / 2}
        r={2}
        fill={colors.border}
        opacity={0.7}
      />
    </motion.g>
  );
}
