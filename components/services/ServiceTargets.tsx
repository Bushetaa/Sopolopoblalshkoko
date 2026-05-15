"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ExternalLink } from "lucide-react";
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-200">Service Targets</h3>
        <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Target
        </Button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400">
            <tr>
              <th className="px-4 py-3 font-medium w-full">Target URL</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Weight</th>
              {lbPolicy === 'weighted' && (
                <th className="px-4 py-3 font-medium min-w-[100px]">Distribution</th>
              )}
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {targets.length === 0 ? (
              <tr>
                <td colSpan={lbPolicy === 'weighted' ? 4 : 3} className="px-4 py-8 text-center text-gray-500">
                  No targets configured. You must add at least one target.
                </td>
              </tr>
            ) : (
              targets.map(target => (
                <tr key={target.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    {editingId === target.id ? (
                      <Input 
                        type="url" 
                        value={editValues.url} 
                        onChange={e => setEditValues({...editValues, url: e.target.value})}
                        className="h-8"
                        placeholder="http://localhost:8080"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-300 font-mono text-sm">
                        {target.url}
                        <ExternalLink className="w-3 h-3 text-gray-500" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === target.id ? (
                      <Input 
                        type="number" 
                        min="1"
                        value={editValues.weight} 
                        onChange={e => setEditValues({...editValues, weight: parseInt(e.target.value) || 1})}
                        className="h-8 w-20"
                      />
                    ) : (
                      <span className="text-gray-300">{target.weight || 1}</span>
                    )}
                  </td>
                  {lbPolicy === 'weighted' && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${((target.weight || 1) / totalWeight) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">
                          {Math.round(((target.weight || 1) / totalWeight) * 100)}%
                        </span>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === target.id ? (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleSave(target.id!)}
                          className="h-8 px-2 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            setEditingId(target.id!);
                            setEditValues({ url: target.url, weight: target.weight || 1 });
                          }}
                          className="h-8 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        >
                          Edit
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(target.id!)}
                        className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
}
