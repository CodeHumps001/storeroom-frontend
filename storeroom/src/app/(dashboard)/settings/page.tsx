"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Sun,
  Moon,
  Monitor,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "next-themes";

import apiRequest from "@/lib/api";
import { useMe } from "@/hooks/Useme";

type Toast = { type: "success" | "error"; message: string } | null;

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { me, loading, error } = useMe();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    location: "",
    contact: "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  // Avoid hydration mismatch for theme
  useEffect(() => setMounted(true), []);

  // Pre-fill form when me loads
  useEffect(() => {
    if (me) {
      setFormData({
        organizationName: me.organization.organizationName || "",
        location: me.organization.location || "",
        contact: me.organization.contact || "",
      });
    }
  }, [me]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/organization", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      showToast("success", "Organization settings updated successfully!");
    } catch (err: any) {
      showToast("error", err.message || "Failed to update organization");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="max-w-md border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h3 className="mb-1 text-lg font-semibold text-red-700 dark:text-red-400">
              Error loading settings
            </h3>
            <p className="mb-5 text-sm text-red-600 dark:text-red-300">
              {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-red-600" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your organization and preferences
        </p>
      </div>

      {/* Organization */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-2 dark:bg-orange-950/20">
              <Building2 className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Organization Profile
              </CardTitle>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Update your business information
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizationName" className="text-sm font-medium">
                Organization Name
              </Label>
              <Input
                id="organizationName"
                type="text"
                placeholder="Your business name"
                value={formData.organizationName}
                onChange={handleInputChange}
                className="h-10"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-sm font-medium">
                  Contact Number
                </Label>
                <Input
                  id="contact"
                  type="tel"
                  placeholder="+233 XX XXX XXXX"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
            </div>

            {/* Read-only org type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Organization Type</Label>
              <Input
                value={
                  me?.organization
                    ? me.organization.organizationType
                        .split("_")
                        .map(
                          (w) =>
                            w.charAt(0).toUpperCase() +
                            w.slice(1).toLowerCase(),
                        )
                        .join(" ")
                    : ""
                }
                disabled
                className="h-10 bg-zinc-50 text-zinc-500 dark:bg-zinc-900"
              />
              <p className="text-xs text-zinc-400">
                Organization type cannot be changed
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-black text-white hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-950/20">
              <Sun className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Appearance
              </CardTitle>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Choose your preferred theme
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme selector */}
          {mounted && (
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map(({ value, label, icon: Icon }) => {
                const isActive = theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      isActive
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        isActive
                          ? "text-orange-500"
                          : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Current theme indicator */}
          {mounted && (
            <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-900">
              {resolvedTheme === "dark" ? (
                <Moon className="h-4 w-4 text-zinc-400" />
              ) : (
                <Sun className="h-4 w-4 text-zinc-400" />
              )}
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Currently using{" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {resolvedTheme === "dark" ? "dark" : "light"} mode
                </span>
                {theme === "system" && " (following system preference)"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Org Info */}
      {me && (
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Your Name
                </p>
                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                  {me.name}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Email
                </p>
                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                  {me.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Role
                </p>
                <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                  {me.role.charAt(0) + me.role.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Organization ID
                </p>
                <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 break-all">
                  {me.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
