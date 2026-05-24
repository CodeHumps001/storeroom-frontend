"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { ChevronDown, HelpCircle } from "lucide-react";
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
  ChevronLeft,
  Star,
  TrendingUp,
  HandCoins,
  Receipt,
  Zap,
  Crown,
  Heart,
  Clock,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ── Social Icons ──────────────────────────────────────────────────────────────
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
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
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
const YoutubeIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);
const TiktokIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.89 2.89 2.89 2.89 0 010-5.78 2.89 2.89 0 011.1.21V9.53a6.34 6.34 0 00-5.33 6.16 6.34 6.34 0 006.34 6.34 6.34 6.34 0 005.33-3.1 6.34 6.34 0 001.01-3.24V10.3a8.29 8.29 0 004.5 1.3V8.3a4.83 4.83 0 01-2.34-1.61z" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1400&auto=format&fit=crop",
    caption: "Fast checkout with our POS system",
  },
  {
    url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1400&auto=format&fit=crop",
    caption: "African market women managing their goods",
  },
  {
    url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1400&auto=format&fit=crop",
    caption: "Real-time stock management for your store",
  },
  {
    url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1400&auto=format&fit=crop",
    caption: "Empowering shop owners with smart tools",
  },
];

const marketImages = [
  {
    url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop",
    label: "Market women, Accra",
  },
  {
    url: "https://images.unsplash.com/photo-1596473479361-c7c1b91a71bb?q=80&w=800&auto=format&fit=crop",
    label: "Pharmacy shop, Kumasi",
  },
  {
    url: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=800&auto=format&fit=crop",
    label: "Electronics retailer",
  },
  {
    url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop",
    label: "Grocery store owner",
  },
  {
    url: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=800&auto=format&fit=crop",
    label: "Small business, Takoradi",
  },
  {
    url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop",
    label: "Supermarket aisle",
  },
];

const testimonials = [
  {
    name: "Ama Boateng",
    business: "Ama Mini Mart, Accra",
    quote:
      "Storeroom helped me stop running out of fast-selling products. I now track everything from my phone.",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=300&auto=format&fit=crop",
    metric: "Stock loss reduced by 60%",
    stars: 5,
  },
  {
    name: "Kojo Mensah",
    business: "Mensah Electronics, Kumasi",
    quote:
      "The POS system made checkout much faster. My staff learned it in one day. Real game changer.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    metric: "Saved 25 hours monthly",
    stars: 5,
  },
  {
    name: "Abena Serwaa",
    business: "Serwaa Fashion Hub, Takoradi",
    quote:
      "I can finally see my daily sales clearly and know which products bring profit. Worth every cedi.",
    image:
      "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=300&auto=format&fit=crop",
    metric: "Sales up by 35%",
    stars: 5,
  },
];

const features = [
  {
    icon: Package,
    title: "Inventory Tracking",
    description:
      "Know exactly what's in stock, what's selling fast, and what needs reordering — in real time.",
  },
  {
    icon: Receipt,
    title: "POS & Receipts",
    description:
      "Process sales fast with our POS. Generate PDF receipts instantly. Works on any device.",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description:
      "See your top products, daily revenue, and profit margins. Make decisions backed by data.",
  },
  {
    icon: HandCoins,
    title: "Credit Tracking",
    description:
      "Track customers who buy on credit. Record payments and never forget who owes you.",
  },
  {
    icon: Users,
    title: "Staff Management",
    description:
      "Add cashiers and managers with different access levels. Know who did what, when.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Bank-level security. Automatic backups. Your data is always safe with us.",
  },
];

// ── Animation helpers ─────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  // Put this snippet right into your component tree
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setHeroIndex((i) => (i + 1) % heroImages.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 antialiased">
      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-white/95 shadow-sm backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
              <span className={scrolled ? "text-black" : "text-white"}>
                Store
              </span>
              <span className="text-orange-500">room</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {["Features", "Pricing", "Customers", "FAQ"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                  scrolled ? "text-zinc-600" : "text-white/90"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className={
                  scrolled
                    ? ""
                    : "text-white hover:text-white hover:bg-white/20"
                }
              >
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                Get started free
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`rounded-lg p-2 md:hidden ${scrolled ? "text-zinc-600" : "text-white"}`}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-16 border-b bg-white shadow-lg md:hidden"
            >
              <div className="space-y-1 p-4">
                {["Features", "Pricing", "Customers", "FAQ"].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
                  >
                    {item}
                  </Link>
                ))}
                <div className="flex gap-3 pt-3">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
                      Get started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        {/* Background slideshow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[heroIndex].url}
              alt={heroImages[heroIndex].caption}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === heroIndex ? "w-8 bg-orange-500" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Prev/Next */}
        <button
          onClick={() =>
            setHeroIndex((i) => (i - 1 + heroImages.length) % heroImages.length)
          }
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setHeroIndex((i) => (i + 1) % heroImages.length)}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-300 backdrop-blur-sm">
                Built for African businesses 🇬🇭
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Manage your shop.
              <br />
              <span className="text-orange-400">Grow your business.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-relaxed text-white/80"
            >
              Storeroom gives Ghanaian SMEs a simple, powerful platform to track
              inventory, process sales, manage staff, and understand their
              business — from any device.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Link href="/register">
                <Button className="h-12 gap-2 bg-orange-500 px-8 text-base font-semibold text-white hover:bg-orange-600">
                  Start free — no card needed
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold border-white/30 text-white hover:bg-white/10"
                >
                  Sign in to your account
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4 text-sm text-white/60"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                14-day free trial
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Cancel anytime
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <section className="border-y border-zinc-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { number: "3,500+", label: "Active businesses" },
              { number: "GHS 50M+", label: "Inventory tracked" },
              { number: "98%", label: "Satisfaction rate" },
              { number: "24/7", label: "Customer support" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <p className="text-3xl font-extrabold text-zinc-900">
                  {stat.number}
                </p>
                <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* ── MARKET IMAGE GRID ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Powering businesses across Ghana
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-500">
              From market women in Makola to electronics shops in Kumasi —
              Storeroom works for you.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {marketImages.map((img, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="group relative overflow-hidden rounded-2xl aspect-square">
                  <Image
                    src={img.url}
                    alt={img.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="absolute bottom-2 left-2 right-2 text-center text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {img.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section id="features" className="bg-zinc-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-orange-500">
              Features
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Everything your shop needs
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-500">
              No complicated setup. No training required. Just sign up and
              start.
            </p>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-orange-300 hover:shadow-lg">
                  <div className="mb-4 inline-flex rounded-xl bg-orange-50 p-3 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    {f.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* ── HOW IT WORKS (with background image) ─────────────────────────────── */}
      <section id="how-it-works" className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1600&auto=format&fit=crop"
            alt="African business owner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-orange-400">
              How it works
            </span>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              Up and running in minutes
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              No complicated setup. No IT team needed. Start today.
            </p>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your account",
                desc: "Sign up free in under 2 minutes. No credit card needed. No paperwork.",
                icon: Users,
              },
              {
                step: "02",
                title: "Add your products",
                desc: "Import from Excel or add one by one. Set prices, categories, and stock levels.",
                icon: Package,
              },
              {
                step: "03",
                title: "Start selling",
                desc: "Use the POS to process sales, track inventory, and watch your business grow.",
                icon: TrendingUp,
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/15">
                  <div className="mb-4 inline-flex rounded-xl bg-orange-500/20 p-3">
                    <item.icon className="h-6 w-6 text-orange-400" />
                  </div>
                  <span className="text-4xl font-black text-orange-500/40">
                    {item.step}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section id="customers" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-orange-500">
              Customers
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Real people. Real results.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-500">
              Business owners across Ghana trust Storeroom every single day.
            </p>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex h-full flex-col rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-orange-500 text-orange-500"
                      />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-zinc-600">
                    "{t.quote}"
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-zinc-400">{t.business}</p>
                    </div>
                  </div>
                  <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 w-fit">
                    {t.metric}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      {/* ── PRICING ──────────────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-zinc-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-orange-500">
              Pricing
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Simple, honest pricing
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-500">
              No hidden fees. No surprises. Just what your business needs.
            </p>
          </FadeIn>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {/* Free */}
            <FadeIn>
              <div className="h-full rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:shadow-lg">
                <div className="mb-1 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-zinc-400" />
                  <h3 className="text-xl font-bold">Free</h3>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">GHS 0</span>
                  <span className="text-zinc-500">/month</span>
                </div>
                <p className="mt-2 text-sm text-zinc-500">
                  Perfect for small shops starting out
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Up to 50 products",
                    "Basic inventory tracking",
                    "1 user account",
                    "Email support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="mt-8 block">
                  <Button variant="outline" className="w-full">
                    Get started free
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Pro */}
            <FadeIn delay={0.1}>
              <div className="relative h-full rounded-2xl border-2 border-orange-500 bg-white p-8 shadow-xl transition-all hover:shadow-2xl">
                <div className="absolute -top-3.5 left-6 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                  Most popular
                </div>
                <div className="mb-1 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-orange-500" />
                  <h3 className="text-xl font-bold">Pro</h3>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">GHS 100</span>
                  <span className="text-zinc-500">/month</span>
                </div>
                <p className="mt-2 text-sm text-zinc-500">
                  For growing businesses with more volume
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Unlimited products",
                    "Advanced reports & analytics",
                    "POS system included",
                    "Credit tracking",
                    "Up to 5 staff accounts",
                    "Priority WhatsApp support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0 text-orange-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="mt-8 block">
                  <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
                    Start 14-day free trial
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-500">
            All plans include a 14-day free trial. No credit card required.
            Cancel anytime.
          </p>
        </div>
      </section>
      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="relative overflow-hidden bg-zinc-50/50 py-20 md:py-28 dark:bg-zinc-950/20"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Centered Modern Header */}
          <FadeIn className="mb-16 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold tracking-wider text-orange-600 uppercase dark:bg-orange-500/10 dark:text-orange-400">
              <HelpCircle className="h-3.5 w-3.5" />
              FAQ
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Questions & Answers
            </h2>
            <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">
              Everything you need to know about setting up Storeroom for your
              business.
            </p>
          </FadeIn>

          {/* Modern Accordion List */}
          <div className="space-y-3.5">
            {[
              {
                q: "How much does Storeroom cost?",
                a: "Free plan available for small shops. Pro is GHS 100/month — no setup fees, no contracts.",
              },
              {
                q: "Do I need internet to use it?",
                a: "The dashboard needs internet. A mobile offline mode is on our roadmap for later this year.",
              },
              {
                q: "Can I import my existing products?",
                a: "Yes. You can add products manually or we'll help you import from Excel.",
              },
              {
                q: "Is there a long-term contract?",
                a: "No. Month-to-month. Cancel anytime with no penalties whatsoever.",
              },
              {
                q: "What kind of support do you offer?",
                a: "Free support via email. Pro customers get priority WhatsApp support with fast response times.",
              },
              {
                q: "Is my data safe?",
                a: "Yes. We use bank-level encryption and automatic daily backups. Your data is yours.",
              },
            ].map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <FadeIn key={i} delay={i * 0.04}>
                  <div
                    className={`group rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "border-orange-500/20 bg-white shadow-md shadow-orange-500/5 dark:bg-zinc-900"
                        : "border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`font-semibold text-zinc-900 transition-colors dark:text-zinc-100 ${isOpen ? "text-orange-600 dark:text-orange-400" : ""}`}
                      >
                        {faq.q}
                      </span>
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-50 text-zinc-500 transition-all duration-300 group-hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-zinc-700 ${isOpen ? "rotate-180 !bg-orange-50 text-orange-600 dark:!bg-orange-500/10 dark:text-orange-400" : ""}`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>

                    {/* Smooth Animated Height Container */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-5 text-[14.5px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONTACT (with background image) ──────────────────────────────────── */}
      <section id="contact" className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1600&auto=format&fit=crop"
            alt="African market women"
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/85" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeIn>
              <span className="text-sm font-semibold uppercase tracking-widest text-orange-400">
                Contact us
              </span>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                We're here to help
              </h2>
              <p className="mt-4 text-white/70">
                Have questions? We respond fast. Reach us through any of the
                channels below.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "hello@storeroom.app" },
                  {
                    icon: Phone,
                    label: "Phone / WhatsApp",
                    value: "+233 24 412 3456",
                  },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: "Kumasi, Ashanti Region, Ghana",
                  },
                  {
                    icon: Clock,
                    label: "Support Hours",
                    value: "Monday - Saturday, 8am - 8pm",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                      <Icon className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/50">
                        {label}
                      </p>
                      <p className="text-sm font-medium text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">
                <h3 className="mb-6 text-xl font-bold text-white">
                  Send us a message
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-orange-500"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-orange-500"
                  />
                  <textarea
                    rows={4}
                    placeholder="Your message..."
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-orange-500 resize-none"
                  />
                  <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
                    Send message
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-orange-500 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">
              Ready to grow your business?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-orange-100">
              Join thousands of shop owners across Ghana who use Storeroom every
              day to manage their business smarter.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button className="h-12 gap-2 bg-white px-8 text-base font-semibold text-orange-500 hover:bg-orange-50">
                  Start free trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold border-white/40 text-white hover:bg-white/10"
                >
                  Sign in
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-orange-100/70">
              14-day free trial · No credit card · Cancel anytime
            </p>
          </FadeIn>
        </div>
      </section>
      {/* ── FOOTER (Redesigned & Polished) ─────────────────────────────────────*/}
      <footer className="bg-white border-t border-zinc-100">
        {/* Main Footer */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:col-span-1.5">
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
              <p className="mt-4 text-sm leading-relaxed text-zinc-500 max-w-xs">
                Simple, powerful inventory management for African businesses.
                Empowering shop owners since 2022.
              </p>
              <div className="mt-5 flex gap-3">
                {[
                  { icon: FacebookIcon, href: "#", label: "Facebook" },
                  { icon: TwitterIcon, href: "#", label: "Twitter" },
                  { icon: InstagramIcon, href: "#", label: "Instagram" },
                  { icon: LinkedInIcon, href: "#", label: "LinkedIn" },
                  { icon: YoutubeIcon, href: "#", label: "YouTube" },
                  { icon: TiktokIcon, href: "#", label: "TikTok" },
                ].map((social, i) => (
                  <Link
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-all hover:bg-orange-500 hover:text-white"
                  >
                    <social.icon />
                  </Link>
                ))}
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Product
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  ["Features", "#features"],
                  ["Pricing", "#pricing"],
                  ["How it works", "#how-it-works"],
                  ["Integrations", "#"],
                  ["Roadmap", "#"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-zinc-500 transition hover:text-orange-500"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Company
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  ["About Us", "#"],
                  ["Blog", "#"],
                  ["Careers", "#"],
                  ["Press Kit", "#"],
                  ["Partners", "#"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-zinc-500 transition hover:text-orange-500"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Support
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  ["Help Center", "#"],
                  ["FAQ", "#faq"],
                  ["Contact Us", "#contact"],
                  ["WhatsApp Support", "#"],
                  ["System Status", "#"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-zinc-500 transition hover:text-orange-500"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Legal
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  ["Privacy Policy", "#"],
                  ["Terms of Service", "#"],
                  ["Security", "#"],
                  ["GDPR", "#"],
                  ["Cookie Policy", "#"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-zinc-500 transition hover:text-orange-500"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-100 bg-zinc-50/50">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row">
              <p className="text-sm text-zinc-500">
                &copy; {new Date().getFullYear()} Storeroom. All rights
                reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <Link href="#" className="text-zinc-500 hover:text-orange-500">
                  Privacy
                </Link>
                <Link href="#" className="text-zinc-500 hover:text-orange-500">
                  Terms
                </Link>
                <Link href="#" className="text-zinc-500 hover:text-orange-500">
                  Cookies
                </Link>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-1">
                Made with <Heart className="h-3 w-3 text-red-500" /> in Kumasi,
                Ghana
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
