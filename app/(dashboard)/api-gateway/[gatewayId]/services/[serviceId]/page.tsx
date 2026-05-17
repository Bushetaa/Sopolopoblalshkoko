"use client";

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Server, Plus, Trash2, Activity, Settings2, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServiceTargets } from '@/components/services/ServiceTargets';

export default function ServiceDetailsPage({ params }: { params: Promise<{ gatewayId: string; serviceId: string }> }) {
  const router = useRouter();
  const { gatewayId, serviceId } = use(params);
  const isNew = serviceId === 'new';

  const [name, setName] = useState(isNew ? '' : 'users-service');
  const [protocol, setProtocol] = useState<'http' | 'grpc'>(isNew ? 'http' : 'http');
  const [lbPolicy, setLbPolicy] = useState('round_robin');
  const [collection, setCollection] = useState('');
  const [showHealthCheck, setShowHealthCheck] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  // Health Check State
  const [hcPath, setHcPath] = useState('');
  const [hcInterval, setHcInterval] = useState('');
  const [hcTimeout, setHcTimeout] = useState('');
  const [hcFail, setHcFail] = useState(0);
  const [hcPass, setHcPass] = useState(0);

  const isProMode = true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    router.push(`/api-gateway/${gatewayId}/services`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href={`/api-gateway/${gatewayId}/services`} 
            className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold font-display text-gray-50 flex items-center gap-2">
              <Server className="w-6 h-6 text-blue-400" />
              {isNew ? 'Create Service' : 'Edit Service'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">Configure upstream service logic and target URLs.</p>
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
        {/* Main Config */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-100 border-b border-gray-800 pb-3 mb-4">General Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500/50 outline-none"
                placeholder="e.g. users-service"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Protocol <span className="text-red-500">*</span>
              </label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value as 'http' | 'grpc')}
                className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none"
              >
                <option value="http">HTTP</option>
                <option value="grpc">gRPC</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Load Balancing Policy <span className="text-red-500">*</span>
              </label>
              <select
                value={lbPolicy}
                onChange={(e) => setLbPolicy(e.target.value)}
                className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none"
              >
                <option value="round_robin">Round Robin</option>
                <option value="weighted">Weighted</option>
                <option value="latency">Latency</option>
                <option value="least_connections">Least Connections</option>
                <option value="random">Random</option>
              </select>
            </div>

            {isProMode && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Collection
                </label>
                <select
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none"
                >
                  <option value="">None</option>
                  <option value="col-1">v1</option>
                  <option value="col-2">auth</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Health Checks */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <button 
            type="button"
            onClick={() => setShowHealthCheck(!showHealthCheck)}
            className="w-full flex items-center justify-between p-6 bg-gray-900 hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3 text-gray-100 font-bold text-lg">
              <Activity className="w-5 h-5 text-green-400" />
              Health Check Settings (Advanced)
            </div>
            <Settings2 className={cn("w-5 h-5 text-gray-500 transition-transform duration-200", showHealthCheck && "rotate-90 text-blue-400")} />
          </button>
          
          <div className={cn("px-6 pb-6 space-y-4 border-t border-gray-800 pt-6", !showHealthCheck && "hidden")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Path</label>
                <input type="text" value={hcPath} onChange={(e) => setHcPath(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" placeholder="/health" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Interval (e.g. 10s)</label>
                <input type="text" value={hcInterval} onChange={(e) => setHcInterval(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" placeholder="10s" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Timeout</label>
                <input type="text" value={hcTimeout} onChange={(e) => setHcTimeout(e.target.value)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" placeholder="5s" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Fail Threshold</label>
                  <input type="number" min={0} value={hcFail} onChange={(e) => setHcFail(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Pass Threshold</label>
                  <input type="number" min={0} value={hcPass} onChange={(e) => setHcPass(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Targets Component */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
          <ServiceTargets serviceId={serviceId} lbPolicy={lbPolicy} />
        </div>

        {lbPolicy === 'weighted' && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200">
                You have selected the <strong>Weighted</strong> load balancing policy. Traffic will be distributed proportionally based on the Weight values assigned to each target.
              </p>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !name || targets.some(t => !t.url)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              isNew ? "Create Service" : "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
