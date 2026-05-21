"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  User2,
  Mail,
  Trash2,
  CheckCircle2,
  Loader2,
  Shield,
  Calendar,
  Globe,
  AlertTriangle,
  AtSign,
  Zap,
  Server,
  Network
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

export default function GeneralSettingsPage() {
  const { user, isLoading, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [locale, setLocale] = useState("en");
  const [isSaving, setIsSaving] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setLocale(user.locale || "en");
    }
  }, [user]);

  const handleResendVerification = async () => {
    setIsResendingVerification(true);
    try {
      await apiClient.sendVerificationEmail();
      toast({ title: "Email Sent", description: "A new verification email has been sent to your inbox." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to resend verification email", variant: "destructive" });
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || newEmail === user?.email) return;
    setIsChangingEmail(true);
    try {
      await apiClient.changeEmail(newEmail);
      toast({ title: "Email Change Requested", description: "Please check your new email inbox to verify the change." });
      setNewEmail("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to change email", variant: "destructive" });
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast({ title: "Error", description: "Display name cannot be empty", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({ displayName, locale });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save settings", variant: "destructive" });
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

  // Get initials for fallback avatar
  const initials = (user.displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences.</p>
      </div>

      <Separator />

      {/* Profile Hero Card */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden relative">
        {/* Gradient background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-transparent to-indigo-500/5 pointer-events-none" />
        <CardContent className="relative pt-8 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-gray-700/50 shadow-lg shadow-black/20 ring-2 ring-blue-500/20 transition-all duration-300 group-hover:ring-blue-500/40 group-hover:border-gray-600/50">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName || "Avatar"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div className={`h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-2xl font-bold ${user.avatarUrl ? "hidden" : ""}`}>
                  {initials}
                </div>
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-3 border-gray-900 shadow-sm" />
            </div>

            {/* User info summary */}
            <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
              <h2 className="text-xl font-semibold tracking-tight truncate">{user.displayName || "—"}</h2>
              <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
                {user.emailVerified && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                )}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  {user.defaultRole}
                </span>
                {user.locale && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-500/15 text-gray-400 border border-gray-500/20 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {user.locale.toUpperCase()}
                  </span>
                )}
                {user.createdAt && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-500/15 text-gray-400 border border-gray-500/20 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User2 className="h-5 w-5 text-blue-400" />
            Edit Profile
          </CardTitle>
          <CardDescription>Update your personal profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-gray-950 border-gray-800"
                placeholder="Your name"
                disabled={isSaving}
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
          </div>

          <Separator className="bg-gray-800" />

          <div className="space-y-2">
            <Label htmlFor="email">Current Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-950 border-gray-800 opacity-60 cursor-not-allowed pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newEmail">Change Email</Label>
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


        </CardContent>
        <CardFooter className="border-t border-gray-800 bg-gray-950/30 py-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 ml-auto"
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
            <Shield className="h-5 w-5 text-green-400" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-800">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Email Verified</span>
              </div>
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
                    Resend
                  </Button>
                )}
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  user.emailVerified
                    ? "bg-green-500/15 text-green-400 border border-green-500/20"
                    : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                }`}>
                  {user.emailVerified ? "✓ Verified" : "Pending"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Default Role</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20">
                {user.defaultRole}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 last:pb-0">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Account Created</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-400/60">
            Irreversible actions for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
            <div className="space-y-0.5">
              <h4 className="font-medium text-red-400">Delete Account</h4>
              <p className="text-sm text-red-400/60">
                Permanently delete all data, gateways, and configurations.
              </p>
            </div>
            <Button variant="destructive" className="flex-shrink-0">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
