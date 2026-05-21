import {
  LayoutDashboard, Code2, Globe, Briefcase,
  BarChart3, Zap, Settings,
  FolderOpen, Link2, FileText,
  Activity, Gauge, FileBarChart,
  SlidersHorizontal, Shield, Plug, Users2,
  Server, Route, ScrollText, Target, Workflow
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
        name: "Gateway Manager",
        path: "/api-gateway",
        icon: Globe,
        subItems: [
          { name: "Gateways", path: "/api-gateway", icon: Globe },
          { name: "Services", path: "/api-gateway/services", icon: Server },
          { name: "Service Targets", path: "/api-gateway/service-targets", icon: Target },
          { name: "Routes",   path: "/api-gateway/routes", icon: Route },
          { name: "Plugins",  path: "/api-gateway/plugins", icon: Plug },
          { name: "Developer Hub", path: "/api-gateway/developer-hub", icon: Code2 },
          { name: "Workflow View", path: "/api-gateway/workflow", icon: Workflow }
        ]
      },
      {
        name: "Collections",
        path: "/collections",
        icon: FolderOpen
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
        name: "Logs",
        path: "/logs",
        icon: ScrollText
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
          { name: "Integrations", path: "/settings/integrations", icon: Plug },
          { name: "Users",        path: "/settings/users",        icon: Users2 }
        ]
      }
    ]
  }
];
