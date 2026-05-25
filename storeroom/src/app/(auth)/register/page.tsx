"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/useRegister";

// Organization type options based on your ENUM
const ORGANIZATION_TYPES = [
  { value: "RETAIL", label: "Retail" },
  { value: "WHOLESALE", label: "Wholesale" },
  { value: "GROCERY", label: "Grocery" },
  { value: "SUPERMARKET", label: "Supermarket" },
  { value: "PHARMACY", label: "Pharmacy" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "CAFE", label: "Cafe" },
  { value: "BAKERY", label: "Bakery" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "FASHION", label: "Fashion" },
  { value: "HARDWARE", label: "Hardware" },
  { value: "BEAUTY", label: "Beauty" },
  { value: "BOOKSTORE", label: "Bookstore" },
  { value: "STATIONERY", label: "Stationery" },
  { value: "AUTO_PARTS", label: "Auto Parts" },
  { value: "MOBILE_SHOP", label: "Mobile Shop" },
  { value: "FURNITURE", label: "Furniture" },
  { value: "WAREHOUSE", label: "Warehouse" },
  { value: "DISTRIBUTION", label: "Distribution" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "ECOMMERCE", label: "E-commerce" },
  { value: "SERVICE", label: "Service" },
  { value: "HOSPITAL", label: "Hospital" },
  { value: "CLINIC", label: "Clinic" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "OTHER", label: "Other" },
] as const;

interface RegisterData {
  organizationName: string;
  organizationType: string;
  location: string;
  contact: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterData>({
    organizationName: "",
    organizationType: "",
    location: "",
    contact: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterData>>({});

  const { register, loading, error } = useRegister();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (fieldErrors[id as keyof RegisterData]) {
      setFieldErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateStep1 = () => {
    const errors: Partial<RegisterData> = {};

    if (!formData.organizationName.trim()) {
      errors.organizationName = "Organization name is required";
    }
    if (!formData.organizationType) {
      errors.organizationType = "Please select organization type";
    }
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }
    if (!formData.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.contact)) {
      errors.contact = "Enter a valid phone number";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: Partial<RegisterData> = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Minimum 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  async function registerHandler(e: React.FormEvent) {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    try {
      await register(
        formData.organizationName,
        formData.organizationType,
        formData.location,
        formData.contact,
        formData.name,
        formData.email,
        formData.password,
      );
    } catch (err) {
      console.error("Registration failed:", err);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE - Hidden on mobile */}
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
                Start Your Free Trial
              </div>
              <h2 className="text-5xl font-black leading-[1.1] tracking-tight">
                Get started with
                <span className="text-orange-500"> Storeroom</span>
              </h2>
              <p className="mt-6 max-w-md text-base text-zinc-600 dark:text-zinc-400">
                Join thousands of businesses managing their inventory
                efficiently.
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <p className="text-zinc-500">✓ 14-day free trial</p>
              <p className="text-zinc-500">✓ No credit card</p>
              <p className="text-zinc-500">✓ Cancel anytime</p>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE - Compact Multi-step Form */}
        <section className="flex items-center justify-center bg-white p-4 sm:p-6 dark:bg-black">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-6 flex items-center justify-start gap-3 lg:hidden">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl">
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
                <p className="text-xs text-zinc-500">Create Account</p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      step >= 1
                        ? "bg-orange-500"
                        : "bg-zinc-200 dark:bg-zinc-800"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      step >= 2
                        ? "bg-orange-500"
                        : "bg-zinc-200 dark:bg-zinc-800"
                    }`}
                  />
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-zinc-500">
                <span>Organization</span>
                <span>Account</span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                {step === 1
                  ? "Tell us about your business"
                  : "Create your account"}
              </h2>
              <p className="text-sm text-zinc-500">
                {step === 1
                  ? "Let's start with your organization details"
                  : "Almost there! Set up your login credentials"}
              </p>
            </div>

            {/* Form Card */}
            <Card className="border border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
              <CardContent className="p-6">
                <form onSubmit={registerHandler}>
                  {/* Step 1 - Organization Details */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="organizationName"
                          className="text-sm font-medium"
                        >
                          Organization Name
                        </Label>
                        <Input
                          id="organizationName"
                          type="text"
                          placeholder="Acme Inc."
                          className="mt-1.5 h-10 border-zinc-300 bg-transparent text-sm focus-visible:border-orange-500 focus-visible:ring-0 dark:border-zinc-700"
                          value={formData.organizationName}
                          onChange={handleChange}
                        />
                        {fieldErrors.organizationName && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.organizationName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="organizationType"
                          className="text-sm font-medium"
                        >
                          Organization Type
                        </Label>
                        <select
                          id="organizationType"
                          value={formData.organizationType}
                          onChange={handleChange}
                          className="mt-1.5 h-10 w-full appearance-none rounded-lg border border-zinc-300 bg-transparent px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-0 dark:border-zinc-700 dark:bg-zinc-950"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: "right 0.5rem center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "1.5em 1.5em",
                          }}
                        >
                          <option value="" className="text-zinc-400">
                            Select organization type
                          </option>
                          {ORGANIZATION_TYPES.map((type) => (
                            <option
                              key={type.value}
                              value={type.value}
                              className="text-black dark:text-white"
                            >
                              {type.label}
                            </option>
                          ))}
                        </select>
                        {fieldErrors.organizationType && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.organizationType}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="location"
                          className="text-sm font-medium"
                        >
                          Location
                        </Label>
                        <Input
                          id="location"
                          type="text"
                          placeholder="City, Country"
                          className="mt-1.5 h-10 border-zinc-300 bg-transparent text-sm focus-visible:border-orange-500 focus-visible:ring-0 dark:border-zinc-700"
                          value={formData.location}
                          onChange={handleChange}
                        />
                        {fieldErrors.location && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.location}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="contact"
                          className="text-sm font-medium"
                        >
                          Contact Number
                        </Label>
                        <Input
                          id="contact"
                          type="tel"
                          placeholder="+1 234 567 8900"
                          className="mt-1.5 h-10 border-zinc-300 bg-transparent text-sm focus-visible:border-orange-500 focus-visible:ring-0 dark:border-zinc-700"
                          value={formData.contact}
                          onChange={handleChange}
                        />
                        {fieldErrors.contact && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.contact}
                          </p>
                        )}
                      </div>

                      <Button
                        type="button"
                        onClick={nextStep}
                        className="mt-2 h-10 w-full rounded-lg bg-black text-sm font-semibold text-white transition-all hover:bg-orange-500 dark:bg-white dark:text-black dark:hover:bg-orange-500"
                      >
                        Continue →
                      </Button>
                    </div>
                  )}

                  {/* Step 2 - Account Details */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          className="mt-1.5 h-10 border-zinc-300 bg-transparent text-sm focus-visible:border-orange-500 focus-visible:ring-0 dark:border-zinc-700"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {fieldErrors.name && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="mt-1.5 h-10 border-zinc-300 bg-transparent text-sm focus-visible:border-orange-500 focus-visible:ring-0 dark:border-zinc-700"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {fieldErrors.email && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a password"
                          className="mt-1.5 h-10 border-zinc-300 bg-transparent text-sm focus-visible:border-orange-500 focus-visible:ring-0 dark:border-zinc-700"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        {fieldErrors.password && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.password}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-zinc-500">
                          Minimum 6 characters
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium"
                        >
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          className="mt-1.5 h-10 border-zinc-300 bg-transparent text-sm focus-visible:border-orange-500 focus-visible:ring-0 dark:border-zinc-700"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        {fieldErrors.confirmPassword && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldErrors.confirmPassword}
                          </p>
                        )}
                      </div>

                      {/* Display error from the hook */}
                      {error && (
                        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/20">
                          <p className="text-sm font-medium text-red-500">
                            {error}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          disabled={loading}
                          className="h-10 flex-1 rounded-lg border-zinc-300 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                        >
                          ← Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="h-10 flex-1 rounded-lg bg-black text-sm font-semibold text-white transition-all hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-orange-500"
                        >
                          {loading ? "Creating..." : "Create Account"}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-xs text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-orange-500 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
