// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  CheckCircle,
  Users,
  Package,
  BarChart3,
  Shield,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Smartphone,
  Clock,
  ChevronLeft,
  Star,
  TrendingUp,
  Zap,
  Headphones,
  Cloud,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Social media icons
const TwitterIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// African market gallery images
const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop",
    caption: "Retail shop owner managing inventory with Storeroom",
    alt: "African retail business owner using inventory software",
  },
  {
    url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
    caption: "Modern supermarket inventory management",
    alt: "African supermarket staff organizing products",
  },
  {
    url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1200&auto=format&fit=crop",
    caption: "Point of sale checkout system in action",
    alt: "African cashier using POS system",
  },
  {
    url: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1200&auto=format&fit=crop",
    caption: "Small business owner tracking stock and sales",
    alt: "African entrepreneur using laptop in store",
  },
];
// Customer stories with authentic African imagery
const customerStories = [
  {
    name: "Ama Boateng",
    business: "Ama Mini Mart, Accra",
    quote:
      "Storeroom helped me stop running out of fast-selling products. I now track everything from my phone.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    metric: "Reduced stock loss by 60%",
  },
  {
    name: "Kojo Mensah",
    business: "Mensah Electronics, Kumasi",
    quote:
      "The barcode and POS system made checkout much faster. My staff learned it in one day.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    metric: "Saved 25 hours monthly",
  },
  {
    name: "Abena Serwaa",
    business: "Serwaa Fashion Hub, Takoradi",
    quote:
      "I can finally see my daily sales clearly and know which products bring profit.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    metric: "Sales increased by 35%",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["features", "customers", "how-it-works", "pricing"];
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight - 100) {
            setIsVisible((prev) => ({ ...prev, [section]: true }));
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <Image
                  src="/logo.png"
                  alt="Storeroom"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold">
                <span className="text-black">Store</span>
                <span className="text-orange-500">room</span>
              </span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <Link
                href="#features"
                className="text-sm text-gray-600 hover:text-orange-500"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-gray-600 hover:text-orange-500"
              >
                Pricing
              </Link>
              <Link
                href="#customers"
                className="text-sm text-gray-600 hover:text-orange-500"
              >
                Customers
              </Link>
              <Link
                href="#faq"
                className="text-sm text-gray-600 hover:text-orange-500"
              >
                FAQ
              </Link>
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-black text-white hover:bg-orange-500"
                >
                  Start free trial
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-16 bg-white shadow-lg md:hidden">
            <div className="space-y-1 p-4">
              <Link
                href="#features"
                className="block px-3 py-2 text-sm text-gray-600"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="block px-3 py-2 text-sm text-gray-600"
              >
                Pricing
              </Link>
              <Link
                href="#customers"
                className="block px-3 py-2 text-sm text-gray-600"
              >
                Customers
              </Link>
              <Link
                href="#faq"
                className="block px-3 py-2 text-sm text-gray-600"
              >
                FAQ
              </Link>
              <div className="flex gap-3 pt-4">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button className="w-full bg-black text-white">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Simple inventory management for
                <span className="text-orange-500"> African businesses</span>
              </h1>
              <p className="mb-8 text-lg text-gray-600">
                Track stock, process sales, and understand your business — all
                in one place. Used by 3,500+ shops across Ghana.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/register">
                  <Button className="h-12 px-8 text-base bg-black text-white hover:bg-orange-500">
                    Start free 14-day trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  ✓ No credit card required
                </span>
                <span className="flex items-center gap-1">
                  ✓ Cancel anytime
                </span>
                <span className="flex items-center gap-1">
                  ✓ Free onboarding
                </span>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop"
                  alt="African shop owner using inventory system"
                  width={600}
                  height={500}
                  className="w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { number: "3,500+", label: "Active Businesses" },
              { number: "GHS 50M+", label: "Inventory Value" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Support" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-bold text-black">
                  {stat.number}
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isVisible.features ? "visible" : "hidden"}
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to run your shop
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Simple, powerful tools built for African small businesses
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Package,
                title: "Track inventory",
                description:
                  "Know what's in stock, what's selling, and what needs reordering.",
              },
              {
                icon: Smartphone,
                title: "Works on any device",
                description:
                  "Use on your phone, tablet, or computer. No expensive hardware.",
              },
              {
                icon: BarChart3,
                title: "Sales analytics",
                description:
                  "See which products make you money. Make better decisions.",
              },
              {
                icon: Clock,
                title: "Save time",
                description:
                  "Stop counting stock manually. Our system does the work.",
              },
              {
                icon: Users,
                title: "Team management",
                description:
                  "Give staff different access levels. Know who did what.",
              },
              {
                icon: Shield,
                title: "Secure & reliable",
                description: "Bank-level security. Automatic daily backups.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-gray-100 p-6 transition-all hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-orange-100 p-2.5 text-orange-600">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isVisible.pricing ? "visible" : "hidden"}
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Simple, honest pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              No hidden fees. No surprises. Just what you need.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-8 shadow-sm"
            >
              <h3 className="text-2xl font-bold">Free</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold">GHS 0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Perfect for small shops starting out
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Up to 100 products",
                  "Basic inventory tracking",
                  "Email support",
                  "1 user account",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" className="mt-8 w-full">
                  Get started
                </Button>
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative rounded-2xl border-2 border-orange-500 bg-white p-8 shadow-lg"
            >
              <div className="absolute -top-3 left-8 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                Most popular
              </div>
              <h3 className="text-2xl font-bold">Pro</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold">GHS 99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                For growing businesses with higher volume
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited products",
                  "Advanced analytics & reports",
                  "Priority WhatsApp support",
                  "Up to 5 users",
                  "POS integration",
                  "API access",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="mt-8 w-full bg-orange-500 text-white hover:bg-orange-600">
                  Start free trial
                </Button>
              </Link>
            </motion.div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            All plans include 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* How It Works - Redesigned with cards */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isVisible["how-it-works"] ? "visible" : "hidden"}
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Get started in 3 simple steps
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              No complicated setup. No training required.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Users,
                step: "1",
                title: "Create your account",
                description:
                  "Sign up for free in under 2 minutes. No credit card needed.",
              },
              {
                icon: Package,
                step: "2",
                title: "Add your products",
                description:
                  "Import from Excel or add one by one. Takes just minutes.",
              },
              {
                icon: TrendingUp,
                step: "3",
                title: "Start selling",
                description:
                  "Use our POS or track sales. Watch your business grow.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="mb-4 mt-4 inline-flex rounded-xl bg-orange-100 p-3 text-orange-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Stories */}
      <section id="customers" className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isVisible.customers ? "visible" : "hidden"}
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Trusted by business owners like you
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Real stories from real people using Storeroom every day
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {customerStories.map((story, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-orange-500 text-orange-500"
                    />
                  ))}
                </div>
                <p className="mb-4 text-gray-600">"{story.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{story.name}</p>
                    <p className="text-xs text-gray-500">{story.business}</p>
                  </div>
                </div>
                <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  {story.metric}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Powering businesses across Africa
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              From market stalls to retail stores, Storeroom works for you
            </p>
          </motion.div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-video"
                >
                  <Image
                    src={galleryImages[currentImage].url}
                    alt={galleryImages[currentImage].alt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white">
                      {galleryImages[currentImage].caption}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="mt-4 flex justify-center gap-2">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImage
                      ? "w-6 bg-orange-500"
                      : "w-1.5 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mx-auto mt-4 text-gray-600">
              Everything you need to know about Storeroom
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "How much does Storeroom cost?",
                a: "We have a free plan for small shops. Pro is GHS 99/month. No setup fees, no hidden costs.",
              },
              {
                q: "Can I use it without internet?",
                a: "Yes. Our mobile app works offline and syncs when you're back online.",
              },
              {
                q: "What kind of support do you offer?",
                a: "Free support via WhatsApp, email, and phone. Pro customers get priority support.",
              },
              {
                q: "Can I migrate my existing data?",
                a: "Yes. We'll help you import your products and customers from Excel or other systems.",
              },
              {
                q: "Is there a long-term contract?",
                a: "No. Month-to-month. Cancel anytime with no penalties.",
              },
              {
                q: "Is my data secure?",
                a: "Yes. Bank-level encryption, regular backups, and secure servers.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="rounded-xl bg-white p-5"
              >
                <h3 className="mb-2 font-semibold">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to grow your business?
            </h2>
            <p className="mb-8 text-gray-400">
              Join 3,500+ shop owners who trust Storeroom
            </p>
            <Link href="/register">
              <Button className="h-12 px-8 text-base bg-white text-black hover:bg-orange-500 hover:text-white">
                Start your free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-6 text-sm text-gray-500">
              14-day free trial. No credit card required. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                  <Image
                    src="/logo.png"
                    alt="Storeroom"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xl font-bold">
                  <span className="text-black">Store</span>
                  <span className="text-orange-500">room</span>
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Simple inventory management for African businesses.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="#features">Features</Link>
                </li>
                <li>
                  <Link href="#pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="#">Integrations</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link href="#">About</Link>
                </li>
                <li>
                  <Link href="#">Blog</Link>
                </li>
                <li>
                  <Link href="#">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> hello@storeroom.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> +233 30 255 1234
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Accra, Ghana
                </li>
              </ul>
              <div className="mt-4 flex gap-3">
                <Link href="#" className="text-gray-500 hover:text-orange-500">
                  <TwitterIcon />
                </Link>
                <Link href="#" className="text-gray-500 hover:text-orange-500">
                  <FacebookIcon />
                </Link>
                <Link href="#" className="text-gray-500 hover:text-orange-500">
                  <InstagramIcon />
                </Link>
                <Link href="#" className="text-gray-500 hover:text-orange-500">
                  <LinkedInIcon />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2025 Storeroom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
