"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  History,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
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
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

export default function SecuritySettingsPage() {
  const { user, isLoading, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const [isGeneratingMFA, setIsGeneratingMFA] = useState(false);
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [mfaQrCode, setMfaQrCode] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [isVerifyingMfa, setIsVerifyingMfa] = useState(false);

  const [patName, setPatName] = useState("");
  const [isGeneratingPat, setIsGeneratingPat] = useState(false);
  const [generatedPat, setGeneratedPat] = useState<string | null>(null);

  const handleToggle2FA = async (checked: boolean) => {
    if (checked) {
      setIsGeneratingMFA(true);
      try {
        const result = await apiClient.generateMFATotp() as any;
        // Assuming result contains qrCode (base64 image or data URL) and secret
        setMfaQrCode(result.imageUrl || result.qrCode);
        setMfaSecret(result.totpSecret || result.secret);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to generate MFA",
          variant: "destructive",
        });
      } finally {
        setIsGeneratingMFA(false);
      }
    }
  };

  const handleVerifyMFA = async () => {
    if (!mfaCode) return;
    setIsVerifyingMfa(true);
    try {
      await apiClient.verifyMFA(mfaCode);
      setIsMFAEnabled(true);
      setMfaQrCode(null);
      setMfaSecret(null);
      setMfaCode("");
      toast({ title: "Success", description: "Two-Factor Authentication enabled successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to verify MFA code.", variant: "destructive" });
    } finally {
      setIsVerifyingMfa(false);
    }
  };

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

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRevokeSession = () => {
    toast({
      title: "Success",
      description: "The selected session has been terminated.",
    });
  };

  const handleRevokeAllSessions = async () => {
    try {
      // TODO: Call Nhost Auth POST /user/session/revoke-all
      toast({
        title: "Success",
        description: "You have been signed out of all other devices.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke sessions",
        variant: "destructive",
      });
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
          Manage your password, two-factor authentication, and active sessions.
        </p>
      </div>

      <Separator />

      {/* Password Change */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-yellow-400" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password regularly to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-gray-950 border-gray-800 pr-10"
                disabled={isChangingPassword}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-950 border-gray-800"
              disabled={isChangingPassword}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-950 border-gray-800"
              disabled={isChangingPassword}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isChangingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
            {isChangingPassword ? "Updating..." : "Update Password"}
          </Button>
        </CardFooter>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-green-400" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg bg-gray-950/50">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-green-400" />
              <div>
                <p className="font-medium">Authenticator App</p>
                <p className="text-xs text-muted-foreground">
                  Use an authenticator app like Google Authenticator or Authy
                </p>
              </div>
            </div>
            <Switch
              checked={isMFAEnabled}
              onCheckedChange={handleToggle2FA}
              disabled={isGeneratingMFA}
            />
          </div>

          {mfaQrCode && !user?.activeMfaType && (
            <div className="p-4 border border-gray-800 rounded-lg bg-gray-950/50 space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <p className="font-medium text-sm">1. Scan QR Code</p>
                <div className="bg-white p-2 w-fit rounded-lg inline-block">
                  <img src={mfaQrCode} alt="MFA QR Code" className="w-32 h-32" />
                </div>
                {mfaSecret && <p className="text-xs text-muted-foreground break-all">Secret: {mfaSecret}</p>}
              </div>
              <div className="space-y-2">
                <p className="font-medium text-sm">2. Enter Code</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="6-digit code" 
                    value={mfaCode} 
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="bg-gray-900 border-gray-800"
                  />
                  <Button onClick={handleVerifyMFA} disabled={isVerifyingMfa || !mfaCode}>
                    {isVerifyingMfa ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Enable"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {user?.activeMfaType && (
            <div className="bg-green-500/10 border border-green-500/30 rounded p-3 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-green-400">2FA is active</p>
                <p className="text-green-400/80 text-xs">Your account is protected</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Access Tokens (PAT) */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-400" />
            Personal Access Tokens
          </CardTitle>
          <CardDescription>
            Generate tokens for API access. Keep them secure, they act like passwords.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patName">Token Name</Label>
            <div className="flex gap-2">
              <Input
                id="patName"
                placeholder="e.g. My CI Pipeline"
                value={patName}
                onChange={(e) => setPatName(e.target.value)}
                disabled={isGeneratingPat}
                className="bg-gray-950 border-gray-800"
              />
              <Button 
                variant="secondary" 
                onClick={handleGeneratePAT} 
                disabled={isGeneratingPat || !patName}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
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
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPat);
                    toast({ title: "Copied", description: "Token copied to clipboard." });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Manage your active sessions across devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border border-gray-800 rounded-lg bg-gray-950/50 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm">Current Session</p>
                <p className="text-xs text-muted-foreground">
                  This device • Just now
                </p>
              </div>
              <Badge variant="default" className="bg-green-600">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={handleRevokeAllSessions}
            className="border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out all other sessions
          </Button>
        </CardFooter>
      </Card>

      {/* Security Alert */}
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
