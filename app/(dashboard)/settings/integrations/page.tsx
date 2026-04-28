"use client";

import React from "react";
import { 
  Plug, 
  Slack, 
  Github, 
  Webhook, 
  ExternalLink, 
  Plus, 
  Settings2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Database,
  Cloud
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function IntegrationsSettingsPage() {
  const handleConnect = (name: string) => {
    toast.info(`Connecting to ${name}`, {
      description: `Opening ${name} authorization flow...`,
    });
  };

  const handleDisconnect = (name: string) => {
    toast.success(`Disconnected from ${name}`, {
      description: `Your ${name} integration has been removed.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect Sopo with your favorite tools and services.
        </p>
      </div>

      <Separator />

      {/* Messaging & Collaboration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Plug className="h-5 w-5 text-blue-400" />
          Messaging & Collaboration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-[#4A154B]/10 flex items-center justify-center">
                  <Slack className="h-6 w-6 text-[#4A154B]" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Connected</Badge>
              </div>
              <CardTitle className="text-base mt-4">Slack</CardTitle>
              <CardDescription className="text-xs">
                Send alerts and notifications directly to your Slack channels.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 border-gray-800">
                <Settings2 className="mr-2 h-3 w-3" />
                Configure
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDisconnect("Slack")} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-gray-800 flex items-center justify-center">
                  <Github className="h-6 w-6 text-white" />
                </div>
                <Badge variant="outline" className="text-[10px] text-muted-foreground">Not Connected</Badge>
              </div>
              <CardTitle className="text-base mt-4">GitHub</CardTitle>
              <CardDescription className="text-xs">
                Sync your API documentation and schemas with your repositories.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button variant="secondary" size="sm" onClick={() => handleConnect("GitHub")} className="w-full">
                <Plus className="mr-2 h-3 w-3" />
                Connect
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Monitoring & Analytics */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Database className="h-5 w-5 text-amber-400" />
          Monitoring & Analytics
        </h3>
        <Card className="border-gray-800 bg-gray-900/50">
          <CardContent className="p-0">
            {[
              { 
                name: "Datadog", 
                desc: "Stream logs and metrics to your Datadog dashboard.", 
                icon: <Cloud className="h-5 w-5 text-[#632CA6]" />,
                status: "connected" 
              },
              { 
                name: "CloudWatch", 
                desc: "Export gateway logs to AWS CloudWatch for retention.", 
                icon: <Cloud className="h-5 w-5 text-amber-500" />,
                status: "disconnected" 
              }
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-4 ${i === 0 ? '' : 'border-t border-gray-800'}`}>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <Button variant={item.status === 'connected' ? 'outline' : 'secondary'} size="sm">
                  {item.status === 'connected' ? 'Manage' : 'Connect'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Webhooks */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5 text-emerald-400" />
                Webhooks
              </CardTitle>
              <CardDescription>
                Receive real-time events in your own services.
              </CardDescription>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-gray-800 bg-gray-950 divide-y divide-gray-800">
            <div className="p-4 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-mono text-blue-400">https://api.acme.com/webhooks/sopo</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Events:</span>
                    <Badge variant="secondary" className="text-[9px] h-3 px-1.5">api.created</Badge>
                    <Badge variant="secondary" className="text-[9px] h-3 px-1.5">alert.triggered</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-mono text-gray-500 line-through">https://dev.webhook.site/test</p>
                  <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Last delivery failed (404)
                  </p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
