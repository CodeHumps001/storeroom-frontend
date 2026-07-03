"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Receipt, HandCoins, Clock } from "lucide-react";

// ── Animation helper ─────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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

// ── Types ────────────────────────────────────────────────────────────────
interface PublicStats {
  organizationsCount: number;
  salesCount: number;
  totalSalesValue: number;
  totalUnitsTracked: number;
}

function useStats() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/public`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((res) => {
        if (!cancelled) setStats(res.data);
      })
      .catch(() => {
        if (!cancelled) setStats(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading };
}

// ── Component ────────────────────────────────────────────────────────────
export function StatsSection() {
  const { stats, loading } = useStats();

  const hasBusinesses = !!stats && stats.organizationsCount > 0;

  const cards = [
    {
      icon: Users,
      number: hasBusinesses
        ? `${stats!.organizationsCount}+`
        : "You could be #1",
      label: hasBusinesses
        ? "Active businesses"
        : "Now onboarding early businesses",
    },
    {
      icon: Receipt,
      number: stats ? `${stats.salesCount}` : "0",
      label: "Sales processed",
    },
    {
      icon: HandCoins,
      number: stats ? `GHS ${stats.totalSalesValue.toLocaleString()}` : "GHS 0",
      label: "Processed through Storeroom",
    },
    {
      icon: Clock,
      number: "14-day",
      label: "Free trial, no card required",
    },
  ];

  return (
    <section className="bg-zinc-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            Growing every day
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {hasBusinesses
              ? "Storeroom in numbers"
              : "Be part of the beginning"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-zinc-500">
            {hasBusinesses
              ? "Real numbers, updated live from businesses using Storeroom right now."
              : "These numbers update live as real businesses join Storeroom — starting with you."}
          </p>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-zinc-200 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg">
                <div className="mx-auto mb-4 inline-flex rounded-xl bg-orange-50 p-3 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                  <card.icon className="h-5 w-5" />
                </div>

                {loading ? (
                  <div className="mx-auto h-8 w-20 animate-pulse rounded bg-zinc-100" />
                ) : (
                  <p className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
                    {card.number}
                  </p>
                )}
                <p className="mt-1.5 text-sm text-zinc-500">{card.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
