"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import apiRequest from "@/lib/api";

type Toast = { type: "success" | "error"; message: string } | null;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    if (!token) {
      showToast("error", "Invalid or missing reset token");
    }
  }, [token]);

  const validateForm = () => {
    if (!password) {
      showToast("error", "Please enter a new password");
      return false;
    }
    if (password.length < 6) {
      showToast("error", "Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showToast("error", "Invalid reset link. Please request a new one.");
      return;
    }
    if (!validateForm()) return;
    setLoading(true);
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword: password }),
      });
      setSubmitted(true);
      showToast(
        "success",
        "Password reset successfully! Redirecting to login...",
      );
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      showToast(
        "error",
        err.message || "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all ${
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

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left */}
        <section className="relative hidden overflow-hidden border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 lg:flex">
          <div className="absolute inset-0 opacity-40 dark:opacity-20">
            <div className="h-full w-full bg-[linear-gradient(to_right,#f9731610_1px,transparent_1px),linear-gradient(to_bottom,#f9731610_1px,transparent_1px)] bg-[size:6rem_6rem]" />
          </div>
          <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="relative flex flex-1 flex-col justify-between p-14">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl">
                <Image
                  src="/logo.jpeg"
                  alt="Storeroom Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  <span className="text-black dark:text-white">Store</span>
                  <span className="text-orange-500">room</span>
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Smart Inventory Management
                </p>
              </div>
            </div>
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                Create New Password
              </div>
              <h2 className="text-5xl font-black leading-[1.1] tracking-tight">
                Set a new<span className="text-orange-500"> password</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                Choose a strong password that you haven't used before.
              </p>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <p className="text-zinc-500 dark:text-zinc-400">Secure Reset</p>
              <p className="text-zinc-500 dark:text-zinc-400">
                End-to-End Encrypted
              </p>
              <p className="text-zinc-500 dark:text-zinc-400">Fast Recovery</p>
            </div>
          </div>
        </section>

        {/* Right */}
        <section className="flex items-center justify-center bg-white p-6 dark:bg-black">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl">
                <Image
                  src="/logo.jpeg"
                  alt="Storeroom Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold">
                  <span className="text-black dark:text-white">Store</span>
                  <span className="text-orange-500">room</span>
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Reset Password
                </p>
              </div>
            </div>

            <div className="mb-10 space-y-3">
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                New password
              </h2>
              <p className="text-base text-zinc-500 dark:text-zinc-400">
                Create a new password for your account.
              </p>
            </div>

            <Card className="border border-zinc-200 bg-white/80 shadow-none backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
              <CardContent className="p-6 sm:p-8">
                {!submitted ? (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="h-11 border-zinc-300 bg-transparent pr-10 placeholder:text-zinc-400 focus-visible:border-orange-500 focus-visible:ring-0 dark:border-zinc-700"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500">
                        Must be at least 6 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          className="h-11 border-zinc-300 bg-transparent pr-10 placeholder:text-zinc-400 focus-visible:border-orange-500 focus-visible:ring-0 dark:border-zinc-700"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {password &&
                      confirmPassword &&
                      password !== confirmPassword && (
                        <p className="text-xs text-red-500">
                          Passwords do not match
                        </p>
                      )}

                    <Button
                      type="submit"
                      disabled={loading || !token}
                      className="h-11 w-full rounded-lg bg-black text-base font-semibold text-white transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-orange-500"
                    >
                      {loading ? (
                        "Resetting..."
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Reset Password
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      Password reset successful!
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Redirecting you to login...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-orange-500 hover:underline"
              >
                Back to login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
