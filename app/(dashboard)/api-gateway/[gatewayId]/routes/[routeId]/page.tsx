"use client";

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Route as RouteIcon, GitMerge, Link as LinkIcon, Trash2, Plus, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RouteDetailsPage({ params }: { params: Promise<{ gatewayId: string; routeId: string }> }) {
  const router = useRouter();
  const { gatewayId, routeId } = use(params);
  const isNew = routeId === 'new';

  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('');
  const [protocol, setProtocol] = useState('http');
  const [timeout, setTimeoutVal] = useState('30s');
  const [collection, setCollection] = useState('');
  const [isAggregate, setIsAggregate] = useState(false);

  // Standard specific
  const [service, setService] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [websocket, setWebsocket] = useState(false);
  const [retryMax, setRetryMax] = useState('');
  const [retryStatus, setRetryStatus] = useState('');

  // Aggregate specific
  const [mergeStrategy, setMergeStrategy] = useState('merge_object');
  const [aggTimeout, setAggTimeout] = useState('30s');
  const [partialFailure, setPartialFailure] = useState(false);
  const [subRequests, setSubRequests] = useState<{ id: string; key: string; service: string; targetPath: string; method: string; required: boolean; timeout: string }[]>(
    isNew ? [] : []
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleAddSubRequest = () => {
    setSubRequests([...subRequests, { id: Math.random().toString(), key: '', service: '', targetPath: '', method: 'GET', required: false, timeout: '' }]);
  };

  const handleRemoveSubRequest = (id: string) => {
    setSubRequests(subRequests.filter(s => s.id !== id));
  };

  const updateSubRequest = (id: string, field: string, value: any) => {
    setSubRequests(subRequests.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => globalThis.setTimeout(r, 1000));
    router.push(`/api-gateway/${gatewayId}/routes`);
  };

  const isProMode = true;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href={`/api-gateway/${gatewayId}/routes`} 
            className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold font-display text-gray-50 flex items-center gap-2">
              <RouteIcon className="w-6 h-6 text-blue-400" />
              {isNew ? 'Create Route' : 'Edit Route'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">Define how incoming requests are matched and forwarded.</p>
          </div>
        </div>
        {!isNew && (
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg font-medium transition-colors border border-red-500/20">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Information */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-100 border-b border-gray-800 pb-3 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Method <span className="text-red-500">*</span>
              </label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
                <option value="ANY">ANY</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Path <span className="text-red-500">*</span>
              </label>
              <input type="text" value={path} onChange={(e) => setPath(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500/50 outline-none font-mono text-sm" placeholder="/api/users/:id" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Protocol</label>
              <select value={protocol} onChange={(e) => setProtocol(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none">
                <option value="http">HTTP</option>
                <option value="grpc">gRPC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Timeout</label>
              <input type="text" value={timeout} onChange={(e) => setTimeoutVal(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="30s" />
            </div>
            {isProMode && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Collection</label>
                <select value={collection} onChange={(e) => setCollection(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none">
                  <option value="">None</option>
                  <option value="col-1">v1</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Route Type Selection */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-300 mb-3">Route Type</label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={cn("p-4 border rounded-xl cursor-pointer transition-all", !isAggregate ? "bg-blue-500/10 border-blue-500" : "bg-gray-950 border-gray-800 hover:border-gray-700")}
              onClick={() => setIsAggregate(false)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-gray-100 font-medium">
                  <LinkIcon className={cn("w-5 h-5", !isAggregate ? "text-blue-400" : "text-gray-500")} />
                  Standard Route
                </div>
                <div className={cn("w-4 h-4 rounded-full border-2", !isAggregate ? "border-blue-500 bg-blue-500" : "border-gray-600")}>
                  {!isAggregate && <div className="w-full h-full rounded-full bg-white scale-50" />}
                </div>
              </div>
              <p className="text-xs text-gray-400">Routes traffic to a single upstream service.</p>
            </div>
            <div 
              className={cn("p-4 border rounded-xl cursor-pointer transition-all", isAggregate ? "bg-purple-500/10 border-purple-500" : "bg-gray-950 border-gray-800 hover:border-gray-700")}
              onClick={() => setIsAggregate(true)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-gray-100 font-medium">
                  <GitMerge className={cn("w-5 h-5", isAggregate ? "text-purple-400" : "text-gray-500")} />
                  Aggregate Route
                </div>
                <div className={cn("w-4 h-4 rounded-full border-2", isAggregate ? "border-purple-500 bg-purple-500" : "border-gray-600")}>
                  {isAggregate && <div className="w-full h-full rounded-full bg-white scale-50" />}
                </div>
              </div>
              <p className="text-xs text-gray-400">Combines responses from multiple services into one.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Section based on Route Type */}
        {!isAggregate ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-100 border-b border-gray-800 pb-3 mb-4">Upstream Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Service <span className="text-red-500">*</span></label>
                <select value={service} onChange={(e) => setService(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 outline-none" required={!isAggregate}>
                  <option value="">Select Service...</option>
                  <option value="svc-1">users-service</option>
                  <option value="svc-2">payments-grpc</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Target Path Rewrite (Optional)</label>
                <input type="text" value={targetPath} onChange={(e) => setTargetPath(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 font-mono text-sm" placeholder="/internal/users" />
              </div>
              <div className="pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={websocket} onChange={(e) => setWebsocket(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  <span className="ml-3 text-sm font-medium text-gray-300">Enable WebSocket Support</span>
                </label>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-6">
              <h4 className="text-sm font-bold text-gray-300 mb-4">Retry Policies</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Max Retry Attempts</label>
                  <input type="number" min={0} value={retryMax} onChange={(e) => setRetryMax(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" placeholder="e.g. 3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Retry On Status (comma separated)</label>
                  <input type="text" value={retryStatus} onChange={(e) => setRetryStatus(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 font-mono text-sm" placeholder="e.g. 500,502,503" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-100 border-b border-gray-800 pb-3 mb-4">Aggregation Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Merge Strategy <span className="text-red-500">*</span></label>
                <select value={mergeStrategy} onChange={(e) => setMergeStrategy(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 outline-none">
                  <option value="merge_object">Merge Object</option>
                  <option value="merge_array">Merge Array</option>
                  <option value="first_success">First Success</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Aggregate Timeout</label>
                <input type="text" value={aggTimeout} onChange={(e) => setAggTimeout(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" placeholder="30s" />
              </div>
              <div className="pt-2 md:col-span-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={partialFailure} onChange={(e) => setPartialFailure(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  <span className="ml-3 text-sm font-medium text-gray-300">Allow Partial Failure</span>
                </label>
                <p className="text-xs text-gray-500 mt-2 ml-14">If enabled, the gateway will return a 200 OK with available data even if some non-required sub-requests fail.</p>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-300">Sub-Requests</h4>
                <button type="button" onClick={handleAddSubRequest} className="flex items-center gap-1.5 text-xs bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 px-3 py-1.5 rounded-lg transition-colors border border-purple-500/20">
                  <Plus className="w-4 h-4" /> Add Sub-Request
                </button>
              </div>

              {subRequests.length === 0 ? (
                <div className="bg-gray-950 border border-dashed border-gray-800 rounded-lg p-6 text-center text-gray-500 text-sm flex flex-col items-center">
                  <Info className="w-6 h-6 mb-2 text-gray-600" />
                  No sub-requests added. Add at least one to perform aggregation.
                </div>
              ) : (
                <div className="space-y-4">
                  {subRequests.map((sub, idx) => (
                    <div key={sub.id} className="bg-gray-950 p-4 rounded-lg border border-gray-800 flex flex-col gap-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-400 mb-1">Key Name (JSON Key)</label>
                          <input type="text" value={sub.key} onChange={(e) => updateSubRequest(sub.id, 'key', e.target.value)} className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-sm text-gray-100" placeholder="e.g. users" required />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-400 mb-1">Service</label>
                          <select value={sub.service} onChange={(e) => updateSubRequest(sub.id, 'service', e.target.value)} className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-sm text-gray-100" required>
                            <option value="">Select...</option>
                            <option value="svc-1">users-service</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-400 mb-1">Target Path</label>
                          <input type="text" value={sub.targetPath} onChange={(e) => updateSubRequest(sub.id, 'targetPath', e.target.value)} className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-sm text-gray-100 font-mono" placeholder="/api/users" required />
                        </div>
                      </div>
                      <div className="flex gap-4 items-end">
                        <div className="w-32">
                          <label className="block text-xs font-medium text-gray-400 mb-1">Method</label>
                          <select value={sub.method} onChange={(e) => updateSubRequest(sub.id, 'method', e.target.value)} className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-sm text-gray-100">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                          </select>
                        </div>
                        <div className="w-32">
                          <label className="block text-xs font-medium text-gray-400 mb-1">Timeout (Opt)</label>
                          <input type="text" value={sub.timeout} onChange={(e) => updateSubRequest(sub.id, 'timeout', e.target.value)} className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-sm text-gray-100" placeholder="e.g. 5s" />
                        </div>
                        <div className="flex-1 pb-2">
                          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                            <input type="checkbox" checked={sub.required} onChange={(e) => updateSubRequest(sub.id, 'required', e.target.checked)} className="rounded border-gray-700 bg-gray-900 text-purple-500 focus:ring-purple-500/20" />
                            Required (fails aggregation if error)
                          </label>
                        </div>
                        <button type="button" onClick={() => handleRemoveSubRequest(sub.id)} className="p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors mb-1">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-lg font-medium transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isLoading || !path} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]">
            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isNew ? "Create Route" : "Save Changes")}
          </button>
        </div>
      </form>
    </div>
  );
}
