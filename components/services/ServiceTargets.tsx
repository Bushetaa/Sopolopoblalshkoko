"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ExternalLink, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceTarget, apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface ServiceTargetsProps {
  serviceId: string;
  lbPolicy: string;
}

export function ServiceTargets({ serviceId, lbPolicy }: ServiceTargetsProps) {
  const [targets, setTargets] = useState<ServiceTarget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{url: string, weight: number}>({ url: '', weight: 1 });

  // Fetch targets
  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const data = await apiClient.serviceTargets.getAll();
        // Filter by serviceId
        setTargets(data.filter(t => t.service_id === serviceId));
      } catch (error) {
        console.error("Failed to fetch targets", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTargets();
  }, [serviceId]);

  const totalWeight = targets.reduce((sum, t) => sum + (t.weight || 1), 0);

  const handleAdd = () => {
    const newTarget: ServiceTarget = {
      id: `new-${Date.now()}`,
      service_id: serviceId,
      url: 'http://',
      weight: 1
    };
    setTargets([...targets, newTarget]);
    setEditingId(newTarget.id!);
    setEditValues({ url: newTarget.url, weight: newTarget.weight || 1 });
  };

  const handleSave = async (id: string) => {
    try {
      if (id.startsWith('new-')) {
        // Create new
        const created = await apiClient.serviceTargets.create({
          service_id: serviceId,
          url: editValues.url,
          weight: editValues.weight
        });
        setTargets(targets.map(t => t.id === id ? created : t));
      } else {
        // Update existing
        const updated = await apiClient.serviceTargets.update(id, {
          url: editValues.url,
          weight: editValues.weight
        });
        setTargets(targets.map(t => t.id === id ? updated : t));
      }
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save target", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (targets.length <= 1) {
      alert("At least 1 target is required per service.");
      return;
    }
    
    if (id.startsWith('new-')) {
      setTargets(targets.filter(t => t.id !== id));
      return;
    }

    if (confirm("Are you sure you want to delete this target?")) {
      try {
        await apiClient.serviceTargets.delete(id);
        setTargets(targets.filter(t => t.id !== id));
      } catch (error) {
        console.error("Failed to delete target", error);
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading targets...</div>;
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
            <Target className="w-4.5 h-4.5 text-blue-400 stroke-[2.5px]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">Service Registry</h3>
            <p className="text-[10px] text-[#64748B] font-black uppercase tracking-widest mt-0.5">Active Upstream Targets</p>
          </div>
        </div>
        
        <Button 
          onClick={handleAdd} 
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95 flex items-center gap-2 group h-auto"
        >
          <div className="w-3.5 h-3.5 rounded bg-white/10 flex items-center justify-center">
            <Plus className="w-2.5 h-2.5 text-white stroke-[3.5px]" />
          </div>
          Add Node
        </Button>
      </div>

      <div className="bg-[#050810]/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050810]/80 border-b border-white/5 text-[#64748B] uppercase tracking-[0.2em] text-[9px] font-black">
              <tr>
                <th className="px-5 py-4">Endpoint Address</th>
                <th className="px-5 py-4">Traffic Weight</th>
                {lbPolicy === 'weighted' && (
                  <th className="px-5 py-4">Distribution Map</th>
                )}
                <th className="px-5 py-4 text-right">Node Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {targets.length === 0 ? (
                <tr>
                  <td colSpan={lbPolicy === 'weighted' ? 4 : 3} className="px-5 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center mb-4 border border-white/5">
                        <Target className="w-6 h-6 text-gray-800" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Active Nodes</p>
                    </div>
                  </td>
                </tr>
              ) : (
                targets.map(target => (
                  <tr key={target.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-5 py-3.5">
                      {editingId === target.id ? (
                        <div className="relative group/input">
                          <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569] group-focus-within/input:text-blue-500 transition-colors" />
                          <Input 
                            type="url" 
                            value={editValues.url} 
                            onChange={e => setEditValues({...editValues, url: e.target.value})}
                            className="h-9 pl-9 bg-[#0B101B] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-xs font-mono text-white transition-all"
                            placeholder="http://10.0.0.5:8080"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-blue-500/30 transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-mono text-sm tracking-tight">{target.url}</span>
                            <span className="text-[8px] font-black text-[#475569] uppercase tracking-widest mt-0.5">Physical Endpoint</span>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {editingId === target.id ? (
                        <Input 
                          type="number" 
                          min="1"
                          value={editValues.weight} 
                          onChange={e => setEditValues({...editValues, weight: parseInt(e.target.value) || 1})}
                          className="h-9 w-20 bg-[#0B101B] border-[#1E293B] focus:border-[#2563EB] focus:ring-0 rounded-xl text-xs font-mono text-white text-center"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#0F172A] border border-white/5 flex items-center justify-center text-[10px] font-black text-blue-400 shadow-xl">
                            {target.weight || 1}
                          </div>
                        </div>
                      )}
                    </td>
                    {lbPolicy === 'weighted' && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-1.5 bg-gray-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-500" 
                              style={{ width: `${((target.weight || 1) / totalWeight) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-white/40 tabular-nums">
                            {Math.round(((target.weight || 1) / totalWeight) * 100)}%
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === target.id ? (
                          <Button
                            onClick={() => handleSave(target.id!)}
                            variant="ghost"
                            className="h-8 px-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            <Save className="w-3.5 h-3.5 mr-1.5" />
                            Save
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setEditingId(target.id!);
                              setEditValues({ url: target.url, weight: target.weight || 1 });
                            }}
                            variant="ghost"
                            className="h-8 px-3 rounded-xl text-[#64748B] hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Config
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDelete(target.id!)}
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-xl bg-red-500/5 text-red-400/50 hover:bg-red-500 hover:text-white transition-all border border-transparent hover:border-red-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
