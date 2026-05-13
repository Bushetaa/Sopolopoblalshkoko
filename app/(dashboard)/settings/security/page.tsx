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

  const handleToggle2FA = async (checked: boolean) => {
    if (checked) {
      setIsGeneratingMFA(true);
      try {
        const result = await apiClient.generateMFATotp();
        toast({
          title: "MFA Setup",
          description: "Scan the QR code with your authenticator app",
        });
        // TODO: Show QR code in a modal
        setIsMFAEnabled(true);
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
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground">
          Secure your account, manage passwords, and review active sessions.
        </p>
      </div>

      <Separator />

      {/* Change Password */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-400" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your login password. You'll need your current password to verify your identity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-gray-950 border-gray-800 pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-950 border-gray-800"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-950 border-gray-800"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-400">Passwords do not match.</p>
          )}
          {newPassword && newPassword.length > 0 && newPassword.length < 8 && (
            <p className="text-xs text-yellow-400">Password must be at least 8 characters.</p>
          )}
        </CardContent>
        <CardFooter className="bg-gray-950/50 border-t border-gray-800 py-4">
          <Button
            onClick={handleChangePassword}
            disabled={isChangingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
            className="ml-auto bg-blue-600 hover:bg-blue-700"
          >
            {isChangingPassword ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Lock className="mr-2 h-4 w-4" />
            )}
            Update Password
          </Button>
        </CardFooter>
      </Card>

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
                Add an extra layer of security to your account using TOTP.
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
                <p className="text-sm font-medium">Authenticator App (TOTP)</p>
                <p className="text-xs text-muted-foreground">Use an app like Google Authenticator or Authy.</p>
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
                Personal Access Tokens
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
                    <p className="text-sm font-medium">Current Browser</p>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] h-4">Current Session</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-950 border border-gray-800">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mobile Device - Safari</p>
                  <p className="text-xs text-muted-foreground">Last active 3 hours ago</p>
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
          <Button
            variant="outline"
            onClick={handleRevokeAllSessions}
            className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-gray-800"
          >
            Sign out of all other sessions
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
