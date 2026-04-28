"use client";

import React from "react";
import { 
  Building2, 
  Globe, 
  Mail, 
  MapPin, 
  Camera,
  Save,
  Trash2,
  Languages,
  Clock
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function GeneralSettingsPage() {
  const handleSave = () => {
    toast.success("Settings saved successfully", {
      description: "Your organization settings have been updated.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization's basic information and preferences.
        </p>
      </div>

      <Separator />

      {/* Organization Profile */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-400" />
            Organization Profile
          </CardTitle>
          <CardDescription>
            This information will be displayed across your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-2xl bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-700 group-hover:border-blue-500/50 transition-colors">
                <Camera className="h-8 w-8 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Organization Logo</h4>
              <p className="text-xs text-muted-foreground">
                JPG, GIF or PNG. Max size of 2MB.
              </p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">Upload new</Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" placeholder="Acme Inc." defaultValue="Sopo Platform" className="bg-gray-950 border-gray-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-url">Website URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="org-url" placeholder="https://example.com" defaultValue="https://sopo.io" className="pl-10 bg-gray-950 border-gray-800" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="org-email">Billing Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="org-email" type="email" placeholder="billing@example.com" defaultValue="ops@sopo.io" className="pl-10 bg-gray-950 border-gray-800" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="org-desc">Description</Label>
              <Textarea 
                id="org-desc" 
                placeholder="Brief description of your organization..." 
                defaultValue="Next-generation API Gateway and Management Platform for modern infrastructure."
                className="min-h-[100px] bg-gray-950 border-gray-800 resize-none" 
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-950/50 border-t border-gray-800 py-4">
          <Button onClick={handleSave} className="ml-auto bg-blue-600 hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      {/* Localization & Preferences */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-emerald-400" />
            Localization
          </CardTitle>
          <CardDescription>
            Configure how dates, times, and numbers are displayed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Default Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="bg-gray-950 border-gray-800">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-gray-100">
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="ar">Arabic (العربية)</SelectItem>
                  <SelectItem value="fr">French (Français)</SelectItem>
                  <SelectItem value="de">German (Deutsch)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger className="bg-gray-950 border-gray-800">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-gray-100">
                  <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                  <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                  <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                  <SelectItem value="ast">Arabia Standard Time (AST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="bg-gray-800" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Profile</Label>
              <p className="text-sm text-muted-foreground">
                Allow search engines to index your public documentation.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20 bg-destructive/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-destructive/70">
            Irreversible actions for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="space-y-0.5">
              <h4 className="font-medium text-destructive">Delete Organization</h4>
              <p className="text-sm text-destructive/70">
                Permanently delete all data, workspaces, and users.
              </p>
            </div>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function AlertTriangle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
