"use client";

import React from "react";
import { 
  Shield, 
  Lock, 
  Key, 
  Fingerprint, 
  Smartphone,
  ShieldCheck,
  Clock,
  LogOut,
  Plus,
  MoreVertical,
  History
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function SecuritySettingsPage() {
  const handleToggle2FA = (checked: boolean) => {
    if (checked) {
      toast.info("2FA Setup", {
        description: "Redirecting to two-factor authentication setup...",
      });
    }
  };

  const handleRevokeSession = () => {
    toast.success("Session revoked", {
      description: "The selected session has been terminated.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground">
          Secure your account and manage access permissions.
        </p>
      </div>

      <Separator />

      {/* Two-Factor Authentication */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-purple-400" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              Recommended
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-950 border border-gray-800">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Fingerprint className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Authenticator App</p>
                <p className="text-xs text-muted-foreground">Use an app like Google Authenticator or 1Password.</p>
              </div>
            </div>
            <Switch onCheckedChange={handleToggle2FA} />
          </div>
        </CardContent>
      </Card>

      {/* API Access Tokens */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-400" />
                API Access Tokens
              </CardTitle>
              <CardDescription>
                Manage tokens for programmatic access to the Sopo API.
              </CardDescription>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Token
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Production Gateway", lastUsed: "2 hours ago", created: "Apr 12, 2026" },
              { name: "CI/CD Pipeline", lastUsed: "1 day ago", created: "Mar 20, 2026" },
            ].map((token, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-950 border border-gray-800 group hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{token.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] h-4">Active</Badge>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last used {token.lastUsed}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Rotate Token</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Revoke</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-400" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Currently active login sessions for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">MacBook Pro - Chrome</p>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] h-4">Current Session</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Cairo, Egypt • 192.168.1.1</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-950 border border-gray-800">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">iPhone 15 - Safari</p>
                  <p className="text-xs text-muted-foreground">Cairo, Egypt • 10.0.0.45</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRevokeSession} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="mr-2 h-3 w-3" />
                Revoke
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-950/50 border-t border-gray-800 py-4">
          <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-gray-800">
            Sign out of all other sessions
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
