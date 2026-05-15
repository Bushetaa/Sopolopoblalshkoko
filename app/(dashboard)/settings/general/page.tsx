"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Building2,
  Globe,
  Mail,
  Camera,
  Save,
  Trash2,
  Languages,
  AlertCircle,
  Link as LinkIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

const RESERVED_WORDS = [
  "admin", "api", "healthz", "metrics", "docs", "swagger",
  "static", "assets", "ws", "graphql",
];

export default function GeneralSettingsPage() {
  const { user, isLoading, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [locale, setLocale] = useState("en");
  const [slug, setSlug] = useState("");
  const [hasExistingSlug, setHasExistingSlug] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setLocale(user.locale || "en");
      
      // Fetch user profile slug
      apiClient.userProfiles.getAll().then((profiles) => {
        if (profiles && profiles.length > 0 && profiles[0].slug) {
          setSlug(profiles[0].slug);
          setHasExistingSlug(true);
        }
      }).catch(err => console.error("Failed to fetch slug", err));
    }
  }, [user]);

  const handleResendVerification = async () => {
    setIsResendingVerification(true);
    try {
      await apiClient.sendVerificationEmail();
      toast({
        title: "Email Sent",
        description: "A new verification email has been sent to your inbox.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email",
        variant: "destructive",
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || newEmail === user?.email) return;
    setIsChangingEmail(true);
    try {
      await apiClient.changeEmail(newEmail);
      toast({
        title: "Email Change Requested",
        description: "Please check your new email inbox to verify the change.",
      });
      setNewEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change email",
        variant: "destructive",
      });
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Error",
        description: "Display name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        displayName,
        locale,
      });

      // Update or create slug
      if (slug.trim()) {
        if (hasExistingSlug) {
          await apiClient.userProfiles.update({ slug: slug.trim() });
        } else {
          await apiClient.userProfiles.create({ slug: slug.trim() });
          setHasExistingSlug(true);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center">
          <p className="text-muted-foreground">Please sign in to view settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and preferences.
        </p>
      </div>

      <Separator />

      {/* Profile Information */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-400" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal profile information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-gray-950 border-gray-800 font-mono"
              placeholder="Your name"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Current Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-gray-950 border-gray-800 opacity-50 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Workspace Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              className="bg-gray-950 border-gray-800 font-mono"
              placeholder="my-workspace"
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground">This is used as the base path for all your API Gateway URLs.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newEmail">Change Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="newEmail"
                type="email"
                placeholder="Enter new email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isChangingEmail}
                className="bg-gray-950 border-gray-800"
              />
              <Button 
                variant="secondary" 
                onClick={handleChangeEmail} 
                disabled={isChangingEmail || !newEmail || newEmail === email}
              >
                {isChangingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={user.id}
              disabled
              className="bg-gray-950 border-gray-800 opacity-50 cursor-not-allowed font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locale">Language</Label>
            <Select value={locale} onValueChange={setLocale} disabled={isSaving}>
              <SelectTrigger className="bg-gray-950 border-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      {/* Account Status */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Email Verified</span>
            <div className="flex items-center gap-2">
              {!user.emailVerified && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResendVerification}
                  disabled={isResendingVerification}
                  className="h-7 text-xs border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                >
                  {isResendingVerification ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                  Resend Email
                </Button>
              )}
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                user.emailVerified 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {user.emailVerified ? "Verified" : "Pending"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Default Role</span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
              {user.defaultRole}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Account Created</span>
            <span className="text-xs text-muted-foreground">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Profile */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-400" />
            Profile
          </CardTitle>
          <CardDescription>
            Your account information synced with your Nhost Auth profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-2xl bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-700 group-hover:border-blue-500/50 transition-colors">
                <Camera className="h-8 w-8 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Avatar</h4>
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
              <Label htmlFor="display-name">Display Name</Label>
              <Input id="display-name" placeholder="John Doe" defaultValue="Sopo Team" className="bg-gray-950 border-gray-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" defaultValue="admin@sopo.io" className="pl-10 bg-gray-950 border-gray-800" />
              </div>
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
            Irreversible actions for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="space-y-0.5">
              <h4 className="font-medium text-destructive">Delete Account</h4>
              <p className="text-sm text-destructive/70">
                Permanently delete all data, gateways, and configurations.
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
