import {
  LayoutDashboard, Code2, Globe, Briefcase,
  BarChart3, Zap, Settings,
  FolderOpen, Link2, FileText,
  Activity, Gauge, FileBarChart,
  SlidersHorizontal, Shield, Plug
} from 'lucide-react';
import { MenuSection } from '@/types/layout';

export const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Platform",
    items: [
      {
        name: "Overview",
        path: "/dashboard",
        icon: LayoutDashboard
      },
      {
        name: "API Manager",
        path: "/api-manager",
        icon: Code2,
        subItems: [
          { name: "Collections",   path: "/api-manager/collections", icon: FolderOpen },
          { name: "Endpoints",     path: "/api-manager/endpoints",   icon: Link2 },
          { name: "Documentation", path: "/api-manager/docs",        icon: FileText }
        ]
      },
      {
        name: "API Gateway",
        path: "/api-gateway",
        icon: Globe
      },
      {
        name: "Workspaces",
        path: "/workspaces",
        icon: Briefcase
      }
    ]
  },
  {
    title: "Monitoring",
    items: [
      {
        name: "Analytics Engine",
        path: "/analytics",
        icon: BarChart3,
        badge: "Live",
        badgeVariant: "label"
      },
      {
        name: "Rate Limiting",
        path: "/rate-limiting",
        icon: Zap
      }
    ]
  },
  {
    title: "Configuration",
    items: [
      {
        name: "Settings",
        path: "/settings",
        icon: Settings,
        subItems: [
          { name: "General",      path: "/settings/general",      icon: SlidersHorizontal },
          { name: "Security",     path: "/settings/security",     icon: Shield },
          { name: "Integrations", path: "/settings/integrations", icon: Plug }
        ]
      }
    ]
  }
];
