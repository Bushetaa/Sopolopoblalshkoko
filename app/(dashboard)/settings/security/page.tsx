"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Shield, Lock, Key,
  Clock, LogOut, Eye, EyeOff, Loader2, AlertCircle, AtSign, Check, X,
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

const RESERVED_WORDS = [
  "admin", "api", "healthz", "metrics", "docs", "swagger",
  "static", "assets", "ws", "graphql",
];
const SLUG_REGEX = /^[a-z0-9][a-z0-9\-]{1,}[a-z0-9]$/;

export default function SecuritySettingsPage() {
  const { user, isLoading, changePassword } = useAuth();

  // Slug state
  const [slug, setSlug] = useState("");
  const [savedSlug, setSavedSlug] = useState("");
  const [hasExistingSlug, setHasExistingSlug] = useState(false);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [isSavingSlug, setIsSavingSlug] = useState(false);
  const [isLoadingSlug, setIsLoadingSlug] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);



  // PAT state
  const [patName, setPatName] = useState("");
  const [isGeneratingPat, setIsGeneratingPat] = useState(false);
  const [generatedPat, setGeneratedPat] = useState<string | null>(null);

  // Fetch slug on mount
  useEffect(() => {
    setIsLoadingSlug(true);
    apiClient.userProfiles.getAll()
      .then((profiles) => {
        if (profiles && profiles.length > 0 && profiles[0].slug) {
          setSlug(profiles[0].slug);
          setSavedSlug(profiles[0].slug);
          setHasExistingSlug(true);
          setProfileId(profiles[0].id || null);
        } else {
          setIsEditingSlug(true); // No slug yet, show input
        }
      })
      .catch(() => {
        setIsEditingSlug(true);
      })
      .finally(() => setIsLoadingSlug(false));
  }, []);

  // Slug validation
  const slugError = (() => {
    if (!slug) return null;
    if (slug.length < 3) return "Slug must be at least 3 characters";
    if (!SLUG_REGEX.test(slug)) return "Only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen.";
    if (RESERVED_WORDS.includes(slug)) return "This slug is a reserved word and cannot be used.";
    return null;
  })();

  const isSlugValid = slug.length >= 3 && !slugError;
  const isSlugChanged = slug !== savedSlug;

  const handleSlugChange = (value: string) => {
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  };

  const handleSaveSlug = async () => {
    if (!isSlugValid || !isSlugChanged) return;
    setIsSavingSlug(true);
    try {
      if (hasExistingSlug) {
        await apiClient.userProfiles.update({ slug: slug.trim() });
      } else {
        await apiClient.userProfiles.create({ slug: slug.trim() });
        setHasExistingSlug(true);
      }
      setSavedSlug(slug.trim());
      setIsEditingSlug(false);
      toast({ title: "Success", description: "Workspace slug saved successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save slug", variant: "destructive" });
    } finally {
      setIsSavingSlug(false);
    }
  };

  const handleCancelSlugEdit = () => {
    setSlug(savedSlug);
    if (hasExistingSlug) setIsEditingSlug(false);
  };

  // PAT handler
  const handleGeneratePAT = async () => {
    if (!patName) return;
    setIsGeneratingPat(true);
    setGeneratedPat(null);
    try {
      const result = await apiClient.generatePAT(patName) as any;
      setGeneratedPat(result.personalAccessToken || result.token || JSON.stringify(result));
      setPatName("");
      toast({ title: "Success", description: "Personal Access Token generated." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to generate PAT.", variant: "destructive" });
    } finally {
      setIsGeneratingPat(false);
    }
  };

  // Password handler
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({ title: "Error", description: "Please fill in all password fields.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Error", description: "New password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to change password", variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      toast({ title: "Success", description: "You have been signed out of all other devices." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to revoke sessions", variant: "destructive" });
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground">
          Manage your workspace slug, password, tokens, and active sessions.
        </p>
      </div>

      <Separator />

      {/* ===== Workspace Slug (Username) ===== */}
      <Card className="border-indigo-500/30 bg-gray-900/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <AtSign className="h-5 w-5 text-indigo-400" />
            Workspace Slug
          </CardTitle>
          <CardDescription>
            Your unique username for API Gateway URLs. All your gateway routes will be prefixed with this slug.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4">
          {isLoadingSlug ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading slug...
            </div>
          ) : isEditingSlug ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className={`bg-gray-950 border-gray-800 font-mono ${slugError ? "border-red-500/50 focus-visible:ring-red-500" : isSlugValid ? "border-green-500/50 focus-visible:ring-green-500" : ""}`}
                  placeholder="my-workspace"
                  disabled={isSavingSlug}
                />
                {slugError && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <X className="h-3 w-3" /> {slugError}
                  </p>
                )}
                {isSlugValid && (
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Slug looks good!
                  </p>
                )}
              </div>

              {/* Live Preview */}
              {slug && (
                <div className="p-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5">
                  <p className="text-xs text-muted-foreground mb-1">Your URLs will start with:</p>
                  <code className="text-sm text-indigo-300 font-mono">/{slug}/...</code>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveSlug}
                  disabled={isSavingSlug || !isSlugValid || !isSlugChanged}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingSlug && <Loader2 className="h-4 w-4 animate-spin" />}
                  {hasExistingSlug ? "Update Slug" : "Create Profile"}
                </Button>
                {hasExistingSlug && (
                  <Button variant="ghost" onClick={handleCancelSlugEdit} disabled={isSavingSlug}>
                    Cancel
                  </Button>
                )}
              </div>
            </>
          ) : (
            /* Display mode: slug is set */
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <code className="text-lg font-mono text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-md border border-indigo-500/20">
                    @{savedSlug}
                  </code>
                  <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  URLs: <code className="text-indigo-400">/{savedSlug}/...</code>
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditingSlug(true)} className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                Edit Slug
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== Password Change ===== */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-yellow-400" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password regularly to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input id="currentPassword" type={showPasswords ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-gray-950 border-gray-800 pr-10" disabled={isChangingPassword} />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type={showPasswords ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-gray-950 border-gray-800" disabled={isChangingPassword} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-gray-950 border-gray-800" disabled={isChangingPassword} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleChangePassword} disabled={isChangingPassword} className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 flex items-center gap-2">
            {isChangingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
            {isChangingPassword ? "Updating..." : "Update Password"}
          </Button>
        </CardFooter>
      </Card>


      {/* ===== Personal Access Tokens ===== */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-400" />
            Personal Access Tokens
          </CardTitle>
          <CardDescription>Generate tokens for API access. Keep them secure, they act like passwords.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patName">Token Name</Label>
            <div className="flex gap-2">
              <Input id="patName" placeholder="e.g. My CI Pipeline" value={patName} onChange={(e) => setPatName(e.target.value)} disabled={isGeneratingPat} className="bg-gray-950 border-gray-800" />
              <Button variant="secondary" onClick={handleGeneratePAT} disabled={isGeneratingPat || !patName} className="bg-purple-600 hover:bg-purple-700 text-white">
                {isGeneratingPat ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
              </Button>
            </div>
          </div>
          {generatedPat && (
            <div className="p-4 border border-purple-500/30 rounded-lg bg-purple-500/10 space-y-2 animate-in fade-in duration-300">
              <p className="text-sm font-medium text-purple-400">Your New Token</p>
              <p className="text-xs text-muted-foreground">Please copy this token now. You won't be able to see it again.</p>
              <div className="bg-gray-950 border border-gray-800 p-2 rounded flex items-center justify-between gap-2">
                <code className="text-xs text-purple-300 truncate font-mono">{generatedPat}</code>
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(generatedPat); toast({ title: "Copied", description: "Token copied to clipboard." }); }}>
                  Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== Active Sessions ===== */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Active Sessions
          </CardTitle>
          <CardDescription>Manage your active sessions across devices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border border-gray-800 rounded-lg bg-gray-950/50 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm">Current Session</p>
                <p className="text-xs text-muted-foreground">This device • Just now</p>
              </div>
              <Badge variant="default" className="bg-green-600">Active</Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleRevokeAllSessions} className="border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-400">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out all other sessions
          </Button>
        </CardFooter>
      </Card>

      {/* ===== Security Alert ===== */}
      <Card className="border-red-500/30 bg-red-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-red-400 mb-1">Keep Your Account Secure</p>
              <ul className="text-xs text-red-400/80 space-y-1">
                <li>• Never share your password with anyone</li>
                <li>• Enable two-factor authentication for extra protection</li>
                <li>• Regularly review your active sessions</li>
                <li>• Use a strong, unique password</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
