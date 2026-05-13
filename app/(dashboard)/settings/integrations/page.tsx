"use client";

import React from "react";
import {
  Plug,
  Github,
  ExternalLink,
  Plus,
  Settings2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Webhook,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Google SVG Icon (lucide doesn't have one)
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function IntegrationsSettingsPage() {
  const handleConnectGoogle = () => {
    // TODO: Redirect to Nhost Auth Google OAuth callback
    // window.location.href = `${NHOST_AUTH_URL}/signin/provider/google`;
    toast.info("Connecting to Google", {
      description: "Redirecting to Google Sign-In...",
    });
  };

  const handleConnectGitHub = () => {
    // TODO: Redirect to Nhost Auth GitHub OAuth callback
    // window.location.href = `${NHOST_AUTH_URL}/signin/provider/github`;
    toast.info("Connecting to GitHub", {
      description: "Redirecting to GitHub authorization...",
    });
  };

  const handleDisconnect = (name: string) => {
    toast.success(`Disconnected from ${name}`, {
      description: `Your ${name} account has been unlinked.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect external authentication providers and third-party services.
        </p>
      </div>

      <Separator />

      {/* OAuth / Social Login Providers */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-blue-400" />
          Authentication Providers
        </h3>
        <p className="text-sm text-muted-foreground -mt-2">
          Link external accounts to enable quick sign-in. Managed via Nhost Auth.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Google */}
          <Card className="border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-gray-800">
                  <GoogleIcon className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-[10px] text-muted-foreground">Not Connected</Badge>
              </div>
              <CardTitle className="text-base mt-4">Google</CardTitle>
              <CardDescription className="text-xs">
                Sign in with your Google account. Uses OAuth 2.0 via Nhost Auth.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button variant="secondary" size="sm" onClick={handleConnectGoogle} className="w-full">
                <Plus className="mr-2 h-3 w-3" />
                Connect Google
              </Button>
            </CardFooter>
          </Card>

          {/* GitHub */}
          <Card className="border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-gray-800 flex items-center justify-center">
                  <Github className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Connected</Badge>
              </div>
              <CardTitle className="text-base mt-4">GitHub</CardTitle>
              <CardDescription className="text-xs">
                Sign in with your GitHub account. Uses OAuth 2.0 via Nhost Auth.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 border-gray-800">
                <Settings2 className="mr-2 h-3 w-3" />
                Manage
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDisconnect("GitHub")} className="text-destructive hover:bg-destructive/10">
                <Unlink className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </div>
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
                Receive real-time event notifications in your own services.
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
                    <Badge variant="secondary" className="text-[9px] h-3 px-1.5">gateway.updated</Badge>
                    <Badge variant="secondary" className="text-[9px] h-3 px-1.5">route.created</Badge>
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
