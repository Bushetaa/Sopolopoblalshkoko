"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RouteSubRequest, Service, apiClient } from "@/lib/api-client";

interface AggregateSubRequestsProps {
  routeId: string;
  services: Service[];
}

export function AggregateSubRequests({ routeId, services }: AggregateSubRequestsProps) {
  const [requests, setRequests] = useState<RouteSubRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [editValues, setEditValues] = useState<Partial<RouteSubRequest>>({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await apiClient.routeSubRequests.getAll();
        setRequests(data.filter(r => r.route_id === routeId));
      } catch (error) {
        console.error("Failed to fetch sub-requests", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [routeId]);

  const handleAdd = () => {
    const newReq: RouteSubRequest = {
      id: `new-${Date.now()}`,
      route_id: routeId,
      key_name: 'new_key',
      service_id: services[0]?.id || '',
      target_path: '/',
      method: 'GET',
      is_required: false,
      timeout: '10s'
    };
    setRequests([...requests, newReq]);
    setEditingId(newReq.id!);
    setEditValues(newReq);
  };

  const handleSave = async (id: string) => {
    try {
      if (id.startsWith('new-')) {
        const created = await apiClient.routeSubRequests.create(editValues as any);
        setRequests(requests.map(r => r.id === id ? created : r));
      } else {
        const updated = await apiClient.routeSubRequests.update(id, editValues);
        setRequests(requests.map(r => r.id === id ? updated : r));
      }
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save sub-request", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('new-')) {
      setRequests(requests.filter(r => r.id !== id));
      return;
    }
    if (confirm("Are you sure you want to delete this sub-request?")) {
      try {
        await apiClient.routeSubRequests.delete(id);
        setRequests(requests.filter(r => r.id !== id));
      } catch (error) {
        console.error("Failed to delete sub-request", error);
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading sub-requests...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-200">Sub-Requests</h3>
          <p className="text-sm text-gray-500">Configure requests that will be executed in parallel for this aggregate route.</p>
        </div>
        <Button onClick={handleAdd} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Sub-Request
        </Button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400">
            <tr>
              <th className="px-4 py-3 font-medium">Key Name</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Target Path</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Timeout</th>
              <th className="px-4 py-3 font-medium text-center">Required</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No sub-requests configured. Click 'Add Sub-Request' to start.
                </td>
              </tr>
            ) : (
              requests.map(req => {
                const isEditing = editingId === req.id;
                return (
                  <tr key={req.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Input 
                          value={editValues.key_name} 
                          onChange={e => setEditValues({...editValues, key_name: e.target.value})}
                          className="h-8 w-24"
                        />
                      ) : (
                        <span className="font-mono text-gray-300">{req.key_name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Select 
                          value={editValues.service_id} 
                          onValueChange={v => setEditValues({...editValues, service_id: v})}
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map(s => <SelectItem key={s.id} value={s.id!}>{s.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-gray-400">{services.find(s => s.id === req.service_id)?.name || req.service_id}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Input 
                          value={editValues.target_path} 
                          onChange={e => setEditValues({...editValues, target_path: e.target.value})}
                          className="h-8 min-w-[120px]"
                        />
                      ) : (
                        <span className="text-gray-300">{req.target_path}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Select 
                          value={editValues.method || 'GET'} 
                          onValueChange={v => setEditValues({...editValues, method: v})}
                        >
                          <SelectTrigger className="h-8 w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{req.method || 'GET'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Input 
                          value={editValues.timeout || ''} 
                          onChange={e => setEditValues({...editValues, timeout: e.target.value})}
                          className="h-8 w-20"
                          placeholder="10s"
                        />
                      ) : (
                        <span className="text-gray-400">{req.timeout || '-'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <div className="flex justify-center">
                          <Checkbox 
                            checked={editValues.is_required} 
                            onCheckedChange={v => setEditValues({...editValues, is_required: !!v})}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <span className={`w-2 h-2 rounded-full ${req.is_required ? 'bg-red-400' : 'bg-gray-600'}`} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleSave(req.id!)}
                            className="h-8 px-2 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => {
                              setEditingId(req.id!);
                              setEditValues(req);
                            }}
                            className="h-8 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                          >
                            Edit
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDelete(req.id!)}
                          className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
