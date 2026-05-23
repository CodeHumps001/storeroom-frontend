"use client";

import { useState } from "react";
import Link from "next/link";

import { useLogin } from "@/hooks/useLogin";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login, loading, error } = useLogin();

  async function loginHandler(e: React.FormEvent) {
    e.preventDefault();

    await login(email, password);
  }

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
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
                  src="/logo.png"
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
                Modern SaaS Inventory Platform
              </div>

              <h2
                className="
        text-6xl
        font-black
        leading-[1]
        tracking-tight
      "
              >
                Manage your
                <span className="text-orange-500"> business </span>
                smarter.
              </h2>

              <p
                className="
        mt-8
        max-w-md
        text-lg
        leading-relaxed
        text-zinc-600
        dark:text-zinc-400
      "
              >
                Track products, monitor sales, manage stock levels, and organize
                your operations from one powerful dashboard.
              </p>
            </div>

            {/* FOOTER */}
            <div className="flex items-center gap-8 text-sm">
              <p className="text-zinc-500 dark:text-zinc-400">
                Real-time Tracking
              </p>
              <p className="text-zinc-500 dark:text-zinc-400">Secure Access</p>
              <p className="text-zinc-500 dark:text-zinc-400">
                Analytics Dashboard
              </p>
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
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl">
                <Image
                  src="/logo.png"
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
                  Inventory Management
                </p>
              </div>
            </div>

            {/* HEADING */}
            <div className="mb-8 space-y-3">
              <h2
                className="
                  text-4xl
                  font-black
                  tracking-tight
                  sm:text-5xl
                "
              >
                Welcome back
              </h2>

              <p className="text-base text-zinc-500 dark:text-zinc-400">
                Login to continue managing your inventory.
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
                <form className="space-y-6" onSubmit={loginHandler}>
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
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>

                      <button
                        type="button"
                        className="
                          text-sm
                          text-zinc-500
                          transition
                          hover:text-orange-500
                        "
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="
                        h-11
                        border-zinc-300
                        bg-transparent
                        placeholder:text-zinc-400
                        focus-visible:border-orange-500
                        focus-visible:ring-0
                        dark:border-zinc-700
                      "
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {/* ERROR */}
                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/20">
                      <p className="text-sm font-medium text-red-500">
                        {error}
                      </p>
                    </div>
                  )}

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
                    {loading ? "Logging in..." : "Login to Dashboard"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-orange-500 transition hover:text-orange-600 hover:underline dark:hover:text-orange-400"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Secure access for your inventory system.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
