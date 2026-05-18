"use client";

import React, { useState, useEffect, use } from 'react';
import { Server, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

export default function GatewaySettingsPage({ params }: { params: Promise<{ gatewayId: string }> }) {
  const { gatewayId } = use(params);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'single' | 'pro'>('pro');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchGateway = async () => {
      try {
        const data = await apiClient.gateways.getById(gatewayId);
        setName(data.name);
        setDescription(data.description || '');
        setMode((data.mode as 'single' | 'pro') || 'pro');
        setIsActive(data.is_active);
      } catch (error) {
        console.error("Failed to fetch gateway settings", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (gatewayId) fetchGateway();
  }, [gatewayId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.gateways.update(gatewayId, {
        name,
        description,
        mode,
        is_active: isActive
      });
    } catch (error) {
      console.error("Failed to update gateway", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="space-y-4">
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
            />
          </div>

          <div className="border-t border-gray-800 pt-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Gateway Mode <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={cn(
                  "p-4 border rounded-xl cursor-pointer transition-all",
                  mode === 'single' ? "bg-blue-500/10 border-blue-500" : "bg-gray-950 border-gray-800 hover:border-gray-700"
                )}
                onClick={() => setMode('single')}
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
              </div>

              <div 
                className={cn(
                  "p-4 border rounded-xl cursor-pointer transition-all",
                  mode === 'pro' ? "bg-purple-500/10 border-purple-500" : "bg-gray-950 border-gray-800 hover:border-gray-700"
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
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex justify-between items-center">
          <button
            type="button"
            className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg font-medium transition-colors"
          >
            Delete Gateway
          </button>
          <button
            type="submit"
            disabled={isSaving || !name}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
