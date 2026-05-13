import React from 'react';

interface DynamicPluginConfigProps {
  pluginName: string;
  config: any;
  onChange: (newConfig: any) => void;
}

export default function DynamicPluginConfig({ pluginName, config, onChange }: DynamicPluginConfigProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const renderArrayInput = (field: string, label: string, placeholder: string) => {
    const items = Array.isArray(config[field]) ? config[field] : [];
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="space-y-2">
          {items.map((item: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <input 
                type="text" 
                value={item} 
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[idx] = e.target.value;
                  updateField(field, newItems);
                }}
                className="flex-1 px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-md text-sm text-gray-100" 
              />
              <button 
                type="button" 
                onClick={() => updateField(field, items.filter((_: any, i: number) => i !== idx))}
                className="px-2 text-red-400 hover:bg-red-500/10 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => updateField(field, [...items, ''])}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            + Add Item
          </button>
        </div>
      </div>
    );
  };

  switch (pluginName) {
    case 'jwt':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Secret <span className="text-red-500">*</span></label>
            <input type="password" value={config.secret || ''} onChange={e => updateField('secret', e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" required />
          </div>
          {renderArrayInput('allowedIssuers', 'Allowed Issuers', 'https://issuer.com')}
          {renderArrayInput('allowedAudiences', 'Allowed Audiences', 'my-api')}
        </div>
      );
    case 'ratelimit':
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
            <input type="number" value={config.capacity || 100} onChange={e => updateField('capacity', parseInt(e.target.value))} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Refill Rate</label>
            <input type="number" value={config.refillRate || 10} onChange={e => updateField('refillRate', parseInt(e.target.value))} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Key Type</label>
            <select value={config.keyType || 'ip'} onChange={e => updateField('keyType', e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100">
              <option value="ip">IP Address</option>
              <option value="header">Header</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Backend</label>
            <select value={config.backend || 'redis'} onChange={e => updateField('backend', e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100">
              <option value="redis">Redis</option>
              <option value="memory">Memory</option>
            </select>
          </div>
        </div>
      );
    case 'cors':
      return (
        <div className="space-y-4">
          {renderArrayInput('allowedOrigins', 'Allowed Origins', 'https://example.com')}
          {renderArrayInput('allowedHeaders', 'Allowed Headers', 'Authorization')}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Max Age (seconds)</label>
            <input type="number" value={config.maxAge || 86400} onChange={e => updateField('maxAge', parseInt(e.target.value))} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" />
          </div>
        </div>
      );
    case 'cache':
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">TTL (seconds)</label>
            <input type="number" value={config.ttlSeconds || 300} onChange={e => updateField('ttlSeconds', parseInt(e.target.value))} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Max Items</label>
            <input type="number" value={config.maxItems || 500} onChange={e => updateField('maxItems', parseInt(e.target.value))} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" />
          </div>
        </div>
      );
    default:
      return (
        <div className="text-gray-500 text-sm italic">
          Select a known plugin to see configuration options, or use JSON if custom.
        </div>
      );
  }
}
