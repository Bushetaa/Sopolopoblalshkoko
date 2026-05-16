"use client";

import React, { useEffect, useState } from "react";
import { Plug, Github, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/api-client";
import { toast } from "@/hooks/use-toast";

export default function IntegrationsSettingsPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await apiClient.getUserProviders();
        setProviders(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load providers",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const isConnected = (providerId: string) => {
    return providers.some((p) => p.providerId === providerId);
  };

  const integrations = [
    {
      id: "google",
      name: "Google Workspace",
      description: "Sign in using your Google account and sync profile details.",
      icon: <Mail className="h-6 w-6 text-red-500" />,
    },
    {
      id: "github",
      name: "GitHub",
      description: "Link your GitHub account for quick authentication.",
      icon: <Github className="h-6 w-6 text-gray-900 dark:text-gray-100" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect external authentication providers and third-party services.
        </p>
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Authentication Providers</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((integration) => {
              const connected = isConnected(integration.id);
              return (
                <div
                  key={integration.id}
                  className="flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm"
                >
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    {integration.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium leading-none">{integration.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                    <div className="pt-3 flex items-center justify-between">
                      {connected ? (
                        <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-500">
                          <CheckCircle2 className="h-4 w-4" />
                          Connected
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-muted-foreground">
                          Not connected
                        </div>
                      )}
                      <Button
                        variant={connected ? "outline" : "default"}
                        size="sm"
                        disabled
                        className={connected ? "text-muted-foreground" : ""}
                      >
                        {connected ? "Manage" : "Connect"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
