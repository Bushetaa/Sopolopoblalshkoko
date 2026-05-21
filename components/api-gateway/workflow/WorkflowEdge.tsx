"use client";

import React from "react";
import {
  WorkflowNodeData,
  WorkflowEdgeData,
  NODE_COLORS,
  getEdgePath,
} from "./workflow-utils";

interface WorkflowEdgeProps {
  edge: WorkflowEdgeData;
  sourceNode: WorkflowNodeData;
  targetNode: WorkflowNodeData;
  index: number;
}

export default function WorkflowEdge({
  edge,
  sourceNode,
  targetNode,
  index,
}: WorkflowEdgeProps) {
  const path = getEdgePath(sourceNode, targetNode);
  const sourceColor = NODE_COLORS[edge.sourceType].border;
  const targetColor = NODE_COLORS[edge.targetType].border;
  const gradientId = `edge-gradient-${edge.id}`;
  const glowId = `edge-glow-${edge.id}`;
  const animDelay = index * 0.15;

  return (
    <g
      style={{
        opacity: 0,
        animation: `edgeFadeIn 0.6s ease-out ${animDelay}s forwards`,
      }}
    >
      <defs>
        {/* Gradient along the edge */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={sourceColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={targetColor} stopOpacity="0.8" />
        </linearGradient>
        {/* Glow filter */}
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Glow layer */}
      <path
        d={path}
        fill="none"
        stroke={sourceColor}
        strokeWidth="4"
        strokeOpacity="0.15"
        filter={`url(#${glowId})`}
      />

      {/* Main edge line */}
      <path
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeDasharray="8 6"
        strokeLinecap="round"
        style={{
          animation: `dashFlow 1.5s linear infinite`,
        }}
      />

      {/* Animated dot traveling along the path */}
      <circle r="3" fill={targetColor} opacity="0.9">
        <animateMotion
          dur={`${2.5 + index * 0.3}s`}
          repeatCount="indefinite"
          path={path}
        />
      </circle>
      {/* Dot glow */}
      <circle r="6" fill={targetColor} opacity="0.2">
        <animateMotion
          dur={`${2.5 + index * 0.3}s`}
          repeatCount="indefinite"
          path={path}
        />
      </circle>
    </g>
  );
}
