"use client";

import React, { useMemo } from 'react';
import { DataTable } from '@/components/data-table';
import { ColumnDef, RowAction } from '@/lib/table-utils';
import { StatusBadge } from '@/components/shared';
import { FilterBar } from '@/components/filters';
import { useFilters } from '@/hooks/useFilters';
import { FilterBarConfig } from '@/types/filters';
import { Globe, Shield, Zap, Trash2, Edit, Copy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Endpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: 'active' | 'inactive' | 'maintenance' | 'deprecated' | 'error';
  latency: number;
  uptime: number;
}

const MOCK_ENDPOINTS: Endpoint[] = [
  { id: '1', name: 'Get Users', path: '/v1/users', method: 'GET', status: 'active', latency: 45, uptime: 99.9 },
  { id: '2', name: 'Create Order', path: '/v1/orders', method: 'POST', status: 'active', latency: 120, uptime: 99.5 },
  { id: '3', name: 'Update Profile', path: '/v1/profile', method: 'PUT', status: 'maintenance', latency: 85, uptime: 98.2 },
  { id: '4', name: 'Delete Account', path: '/v1/accounts', method: 'DELETE', status: 'deprecated', latency: 210, uptime: 95.0 },
  { id: '5', name: 'Health Check', path: '/health', method: 'GET', status: 'active', latency: 12, uptime: 100 },
  { id: '6', name: 'Search Catalog', path: '/v2/search', method: 'GET', status: 'error', latency: 0, uptime: 45.5 },
  { id: '7', name: 'Upload Assets', path: '/v1/assets', method: 'POST', status: 'active', latency: 450, uptime: 99.1 },
  { id: '8', name: 'Fetch Analytics', path: '/v1/analytics', method: 'GET', status: 'active', latency: 88, uptime: 99.8 },
  { id: '9', name: 'Process Payment', path: '/v2/payments', method: 'POST', status: 'active', latency: 320, uptime: 99.99 },
  { id: '10', name: 'List Notifications', path: '/v1/notifications', method: 'GET', status: 'inactive', latency: 55, uptime: 99.9 },
  { id: '11', name: 'Get Product Details', path: '/v1/products/:id', method: 'GET', status: 'active', latency: 42, uptime: 99.9 },
  { id: '12', name: 'Update Inventory', path: '/v1/inventory', method: 'PATCH', status: 'active', latency: 110, uptime: 99.7 },
];

const ENDPOINTS_FILTER_CONFIG: FilterBarConfig = {
  showSearch: true,
  searchPlaceholder: 'Search endpoints...',
  categories: [
    { 
      key: 'protocol', // Using protocol as proxy for method for this demo
      label: 'Method', 
      type: 'toggle', 
      options: [
        { label: 'GET', value: 'GET', color: '#60A5FA' },
        { label: 'POST', value: 'POST', color: '#4ADE80' },
        { label: 'PUT', value: 'PUT', color: '#FBBF24' },
        { label: 'DELETE', value: 'DELETE', color: '#F87171' }
      ] 
    },
    { 
      key: 'apiStatus', 
      label: 'Status', 
      type: 'multi', 
      options: [
        { label: 'Active', value: 'active', color: '#4ADE80', count: 8 },
        { label: 'Maintenance', value: 'maintenance', color: '#FBBF24', count: 1 },
        { label: 'Deprecated', value: 'deprecated', color: '#FB923C', count: 1 },
        { label: 'Error', value: 'error', color: '#F87171', count: 1 },
        { label: 'Inactive', value: 'inactive', color: '#6B7280', count: 1 }
      ] 
    },
  ],
};

export default function EndpointsPage() {
  const { 
    filters, 
    activeFiltersCount, 
    filterChips, 
    clearAll,
    toggleCategoryValue,
    setCategory,
    clearCategory,
    setFilters
  } = useFilters(ENDPOINTS_FILTER_CONFIG);

  const columns: ColumnDef<Endpoint>[] = [
    {
      key: 'name',
      header: 'Endpoint Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="text-gray-100 font-bold">{value}</span>
          <span className="text-[10px] text-gray-500 font-mono mt-0.5">{row.id}</span>
        </div>
      )
    },
    {
      key: 'method',
      header: 'Method',
      width: '100px',
      render: (value) => (
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border",
          value === 'GET' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
          value === 'POST' ? "bg-green-500/10 text-green-400 border-green-500/20" :
          value === 'PUT' ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
          value === 'DELETE' ? "bg-red-500/10 text-red-400 border-red-500/20" :
          "bg-gray-500/10 text-gray-400 border-gray-500/20"
        )}>
          {value}
        </span>
      )
    },
    {
      key: 'path',
      header: 'Route Path',
      render: (value) => <code className="text-blue-400/80 text-xs font-mono">{value}</code>
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'latency',
      header: 'Latency',
      align: 'right',
      sortable: true,
      render: (value) => (
        <div className="flex items-center justify-end gap-2">
          <span className={cn(
            "text-xs font-bold tabular-nums",
            value < 100 ? "text-green-400" : value < 300 ? "text-yellow-400" : "text-red-400"
          )}>
            {value > 0 ? `${value}ms` : '—'}
          </span>
          <Zap className={cn("h-3 w-3", value < 100 ? "text-green-500/40" : "text-yellow-500/40")} />
        </div>
      )
    },
    {
      key: 'uptime',
      header: 'Uptime',
      align: 'right',
      sortable: true,
      render: (value) => (
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-gray-300">{value}%</span>
          <div className="w-16 h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
            <div 
              className={cn("h-full rounded-full", value > 99 ? "bg-green-500" : value > 95 ? "bg-yellow-500" : "bg-red-500")}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      )
    }
  ];

  const rowActions: RowAction<Endpoint>[] = [
    { label: 'Edit Endpoint', icon: Edit, onClick: (row) => console.log('Edit', row) },
    { label: 'Duplicate', icon: Copy, onClick: (row) => console.log('Duplicate', row) },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: (row) => console.log('Delete', row) },
  ];

  // Apply filters to data
  const filteredData = useMemo(() => {
    return MOCK_ENDPOINTS.filter(item => {
      // Search filter
      if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase()) && !item.path.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Method (protocol proxy) filter
      const methods = filters.categories.protocol as string[];
      if (methods && methods.length > 0 && !methods.includes(item.method)) {
        return false;
      }
      
      // Status filter
      const statuses = filters.categories.apiStatus as string[];
      if (statuses && statuses.length > 0 && !statuses.includes(item.status)) {
        return false;
      }
      
      return true;
    });
  }, [filters]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-blue-400 font-medium uppercase tracking-wider">
          <Shield className="h-3 w-3" />
          API Manager
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-50 tracking-tight">API Endpoints</h2>
            <p className="text-sm text-gray-500 font-bold mt-1">Manage and monitor your gateway routes</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800 gap-2 font-bold">
              <Globe className="h-4 w-4" />
              Public Docs
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2 shadow-lg shadow-blue-600/20">
              <Plus className="h-4 w-4" />
              Create Endpoint
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar 
        config={ENDPOINTS_FILTER_CONFIG}
        filters={filters}
        onFiltersChange={setFilters}
        activeFiltersCount={activeFiltersCount}
        filterChips={filterChips}
        onClearAll={clearAll}
        onToggleCategory={toggleCategoryValue}
        onSetCategory={setCategory}
        onClearCategory={clearCategory}
      />

      {/* Table Section */}
      <DataTable 
        data={filteredData}
        columns={columns}
        rowActions={rowActions}
        selectable={true}
        density="default"
      />
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
