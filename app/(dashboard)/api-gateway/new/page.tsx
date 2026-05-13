"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Server, Zap, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewGatewayPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'single' | 'pro'>('single');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Mock checking if user already has a single gateway
  const hasSingleGateway = false; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsLoading(true);
    // TODO: Connect to backend
    await new Promise(r => setTimeout(r, 1000));
    router.push('/api-gateway'); // Redirect to gateways list
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/api-gateway" 
          className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-50 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-400" />
            Create Gateway
          </h2>
          <p className="text-sm text-gray-400 mt-1">Configure a new API Gateway to route and manage your traffic.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          
          {/* Name & Active Toggle */}
          <div className="flex gap-6 items-start">
            <div className="flex-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Gateway Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="e.g. My E-commerce API"
                required
              />
            </div>
            <div className="pt-7 flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-300">Active</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description <span className="text-gray-500 text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              placeholder="Briefly describe what this gateway handles..."
            />
          </div>

          <div className="border-t border-gray-800 pt-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Gateway Mode <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Single Mode Option */}
              <div 
                className={cn(
                  "relative p-4 border rounded-xl cursor-pointer transition-all",
                  mode === 'single' 
                    ? "bg-blue-500/10 border-blue-500" 
                    : "bg-gray-950 border-gray-800 hover:border-gray-700",
                  hasSingleGateway && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !hasSingleGateway && setMode('single')}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-gray-100 font-medium">
                    <Zap className={cn("w-5 h-5", mode === 'single' ? "text-blue-400" : "text-gray-500")} />
                    Single Mode
                  </div>
                  <div className={cn("w-4 h-4 rounded-full border-2", mode === 'single' ? "border-blue-500 bg-blue-500" : "border-gray-600")}>
                    {mode === 'single' && <div className="w-full h-full rounded-full bg-white scale-50" />}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Direct routing for simple applications. Perfect if you only need one entry point.
                </p>
                <div className="bg-gray-900 rounded p-2 text-xs font-mono text-gray-500 flex items-center">
                  <span className="text-gray-400">URL:</span> <span className="text-green-400 ml-1">/&#123;slug&#125;</span>/&#123;path&#125;
                </div>
                {hasSingleGateway && (
                  <div className="absolute inset-0 bg-gray-950/60 rounded-xl flex items-center justify-center p-4 text-center backdrop-blur-[1px]">
                    <span className="bg-gray-900 text-yellow-400 text-xs px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1 shadow-xl">
                      <AlertCircle className="w-3 h-3" /> You already have a Single mode gateway
                    </span>
                  </div>
                )}
              </div>

              {/* Pro Mode Option */}
              <div 
                className={cn(
                  "p-4 border rounded-xl cursor-pointer transition-all",
                  mode === 'pro' 
                    ? "bg-purple-500/10 border-purple-500" 
                    : "bg-gray-950 border-gray-800 hover:border-gray-700"
                )}
                onClick={() => setMode('pro')}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-gray-100 font-medium">
                    <Server className={cn("w-5 h-5", mode === 'pro' ? "text-purple-400" : "text-gray-500")} />
                    Pro Mode
                  </div>
                  <div className={cn("w-4 h-4 rounded-full border-2", mode === 'pro' ? "border-purple-500 bg-purple-500" : "border-gray-600")}>
                    {mode === 'pro' && <div className="w-full h-full rounded-full bg-white scale-50" />}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Advanced routing supporting multiple services and collections (API versioning).
                </p>
                <div className="bg-gray-900 rounded p-2 text-[11px] font-mono text-gray-500 flex items-center whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="text-gray-400">URL:</span> <span className="text-green-400 ml-1">/&#123;slug&#125;</span>/&#123;gateway&#125;/&#123;service&#125;/&#123;path&#125;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-800 pt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !name}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Create Gateway"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
