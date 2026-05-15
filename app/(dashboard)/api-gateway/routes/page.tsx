"use client";

import React from 'react';
import Link from 'next/link';
import { Route as RouteIcon, GitMerge, Link as LinkIcon, MoreVertical, Edit, Trash, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { apiClient, GatewayRoute } from '@/lib/api-client';

interface EnhancedRoute extends GatewayRoute {
  gatewayName: string;
  serviceName: string;
}

export default function GlobalRoutesPage() {
  const router = useRouter();
  const [routes, setRoutes] = React.useState<EnhancedRoute[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const fetchData = async () => {
      try {
        const [fetchedRoutes, gateways, services] = await Promise.all([
          apiClient.gatewayRoutes.getAll(),
          apiClient.gateways.getAll(),
          apiClient.services.getAll()
        ]);

        const formatted = fetchedRoutes.map(route => {
          const gw = gateways.find(g => g.id === route.gateway_id);
          const svc = services.find(s => s.id === route.service_id);
          return {
            ...route,
            gatewayName: gw?.name || 'Unknown',
            serviceName: svc?.name || 'Unknown'
          };
        });

        setRoutes(formatted);
      } catch (error) {
        console.error('Failed to fetch routes', error);
      } finally {
        setIsLoading(false);
      }
    };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    setIsDeleting(id);
    try {
      await apiClient.gatewayRoutes.delete(id);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete route", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold font-display text-gray-50">All Routes</h2>
        <p className="text-sm text-gray-400 mt-1">A global view of routes across all your gateways.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Path</th>
              <th className="px-6 py-4 font-medium">Method</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Service(s)</th>
              <th className="px-6 py-4 font-medium">Gateway</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <RouteIcon className="w-12 h-12 text-gray-700 mx-auto mb-3 animate-pulse" />
                  <p className="text-base font-medium text-gray-300">Loading Routes...</p>
                </td>
              </tr>
            ) : routes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <RouteIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-base font-medium text-gray-300">No Routes Found</p>
                </td>
              </tr>
            ) : (
              routes.map((rt) => (
                <tr key={rt.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${rt.gateway_id}/routes/${rt.id}`} className="font-mono text-gray-100 group-hover:text-blue-400 transition-colors">
                      {rt.path}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex font-mono text-xs font-bold px-2 py-1 rounded border",
                      rt.method === 'GET' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      rt.method === 'POST' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    )}>
                      {rt.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {rt.is_aggregate ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                        <GitMerge className="w-3.5 h-3.5" /> Aggregate
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700">
                        <LinkIcon className="w-3.5 h-3.5" /> Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{rt.serviceName}</td>
                  <td className="px-6 py-4">
                    <Link href={`/api-gateway/${rt.gateway_id}/routes`} className="text-gray-400 hover:text-blue-400 transition-colors text-xs">
                      {rt.gatewayName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button disabled={isDeleting === rt.id} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors disabled:opacity-50">
                          {isDeleting === rt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => router.push(`/api-gateway/${rt.gateway_id}/routes/${rt.id}/edit`)} className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Route
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => rt.id && handleDelete(rt.id)}
                          className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-red-500/10 focus:text-red-400 focus:bg-red-500/10"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete Route
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
