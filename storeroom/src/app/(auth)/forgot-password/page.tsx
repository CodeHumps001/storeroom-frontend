"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, XCircle } from "lucide-react";
import apiRequest from "@/lib/api";

type Toast = { type: "success" | "error"; message: string } | null;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("error", "Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setSubmitted(true);
    } catch (err: any) {
      showToast(
        "error",
        err.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      {/* Toast */}
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
        {/* LEFT SIDE */}
        <section
          className="
            relative
            hidden
            overflow-hidden
            border-r
            border-zinc-200
            bg-zinc-50
            dark:border-zinc-800
            dark:bg-zinc-950
            lg:flex
          "
        >
          {/* GRID BACKGROUND */}
          <div className="absolute inset-0 opacity-40 dark:opacity-20">
            <div className="h-full w-full bg-[linear-gradient(to_right,#f9731610_1px,transparent_1px),linear-gradient(to_bottom,#f9731610_1px,transparent_1px)] bg-[size:6rem_6rem]" />
          </div>

          {/* ORANGE BLUR */}
          <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative flex flex-1 flex-col justify-between p-14">
            {/* LOGO */}
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

            {/* HERO TEXT */}
            <div className="max-w-xl">
              <div
                className="
                  mb-6
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-orange-500/20
                  bg-orange-500/10
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-orange-600
                  dark:text-orange-400
                "
              >
                Reset Your Password
              </div>

              <h2
                className="
                  text-5xl
                  font-black
                  leading-[1.1]
                  tracking-tight
                "
              >
                Forgot your
                <span className="text-orange-500"> password?</span>
              </h2>

              <p
                className="
                  mt-6
                  max-w-md
                  text-base
                  leading-relaxed
                  text-zinc-600
                  dark:text-zinc-400
                "
              >
                No worries. Enter your email address and we'll send you a link
                to reset your password.
              </p>
            </div>

            {/* FOOTER */}
            <div className="flex items-center gap-8 text-sm">
              <p className="text-zinc-500 dark:text-zinc-400">Secure Reset</p>
              <p className="text-zinc-500 dark:text-zinc-400">24/7 Support</p>
              <p className="text-zinc-500 dark:text-zinc-400">Fast Recovery</p>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section
          className="
            flex
            items-center
            justify-center
            bg-white
            p-6
            dark:bg-black
          "
        >
          <div className="w-full max-w-md">
            {/* MOBILE LOGO */}
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
                  Password Reset
                </p>
              </div>
            </div>

            {/* HEADING */}
            <div className="mb-10 space-y-3">
              <h2
                className="
                  text-4xl
                  font-black
                  tracking-tight
                  sm:text-5xl
                "
              >
                Reset password
              </h2>
              <p className="text-base text-zinc-500 dark:text-zinc-400">
                Enter your email to receive a reset link.
              </p>
            </div>

            {/* FORM CARD */}
            <Card
              className="
                border
                border-zinc-200
                bg-white/80
                shadow-none
                backdrop-blur-xl
                dark:border-zinc-800
                dark:bg-zinc-950/80
              "
            >
              <CardContent className="p-6 sm:p-8">
                {!submitted ? (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* EMAIL */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="
                          h-11
                          border-zinc-300
                          bg-transparent
                          placeholder:text-zinc-400
                          focus-visible:border-orange-500
                          focus-visible:ring-0
                          dark:border-zinc-700
                        "
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                      />
                    </div>

                    {/* BUTTON */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="
                        h-11
                        w-full
                        rounded-lg
                        bg-black
                        text-base
                        font-semibold
                        text-white
                        transition-all
                        hover:bg-orange-500
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        dark:bg-white
                        dark:text-black
                        dark:hover:bg-orange-500
                      "
                    >
                      {loading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Reset Link
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30">
                      <Mail className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      Check your email
                    </h3>
                    <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                      We've sent a password reset link to{" "}
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        {email}
                      </span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      Didn't receive the email? Check your spam folder or{" "}
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setEmail("");
                        }}
                        className="text-orange-500 hover:underline"
                      >
                        try again
                      </button>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-orange-500 hover:underline font-medium"
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
