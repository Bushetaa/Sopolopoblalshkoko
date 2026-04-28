import { FilterBarConfig } from '@/types/filters';

export const API_MANAGER_FILTERS: FilterBarConfig = {
  showSearch: true,
  searchPlaceholder: 'Search APIs by name, tag...',
  categories: [
    { 
      key: 'apiType',   
      label: 'Type',   
      type: 'multi',   
      options: [
        { label: 'REST', value: 'REST', count: 4 },
        { label: 'GraphQL', value: 'GraphQL', count: 1 },
        { label: 'gRPC', value: 'gRPC', count: 2 },
        { label: 'WebSocket', value: 'WebSocket', count: 1 },
        { label: 'SOAP', value: 'SOAP', count: 1 }
      ] 
    },
    { 
      key: 'apiStatus', 
      label: 'Status', 
      type: 'toggle',  
      options: [
        { label: 'Active', value: 'active', color: '#4ADE80' },
        { label: 'Maintenance', value: 'maintenance', color: '#FBBF24' },
        { label: 'Deprecated', value: 'deprecated', color: '#FB923C' }
      ] 
    },
  ],
};

export const ANALYTICS_FILTERS: FilterBarConfig = {
  showDateRange: true,
  categories: [
    { 
      key: 'environment', 
      label: 'Environment', 
      type: 'single', 
      options: [
        { label: 'All', value: '' },
        { label: 'Production', value: 'production' },
        { label: 'Staging', value: 'staging' },
        { label: 'Development', value: 'development' }
      ] 
    },
    { 
      key: 'statusCode',  
      label: 'Status Code', 
      type: 'toggle', 
      options: [
        { label: '2xx', value: '2xx', color: '#4ADE80' },
        { label: '4xx', value: '4xx', color: '#FB923C' },
        { label: '5xx', value: '5xx', color: '#F87171' }
      ] 
    },
  ],
};

export const USERS_FILTERS: FilterBarConfig = {
  showSearch: true,
  searchPlaceholder: 'Search by name, email...',
  categories: [
    { 
      key: 'role',       
      label: 'Role',   
      type: 'multi',  
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Developer', value: 'developer' },
        { label: 'Viewer', value: 'viewer' },
        { label: 'Billing', value: 'billing' }
      ] 
    },
    { 
      key: 'userStatus', 
      label: 'Status', 
      type: 'toggle', 
      options: [
        { label: 'Active', value: 'active', color: '#4ADE80' },
        { label: 'Inactive', value: 'inactive', color: '#6B7280' },
        { label: 'Pending', value: 'pending', color: '#FBBF24' }
      ] 
    },
  ],
};
