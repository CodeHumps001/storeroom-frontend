"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ── Animation helper (self-contained, no external dependency) ──────────────
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

// ── Data hook ────────────────────────────────────────────────────────────
function useStats() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        if (!cancelled) {
          setStats(null);
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading, error };
}

// ── Component ────────────────────────────────────────────────────────────
export function StatsSection() {
  const { stats, loading } = useStats();

  const hasBusinesses = !!stats && stats.organizationsCount > 0;

  const businessNumber = hasBusinesses
    ? `${stats!.organizationsCount}+`
    : "You could be #1";
  const businessLabel = hasBusinesses
    ? "Active businesses"
    : "Now onboarding early businesses";

  const displayStats = [
    { number: businessNumber, label: businessLabel },
    {
      number: stats ? `${stats.salesCount}` : "0",
      label: "Sales processed",
    },
    {
      number: stats ? `GHS ${stats.totalSalesValue.toLocaleString()}` : "GHS 0",
      label: "Processed through Storeroom",
    },
    { number: "14-day", label: "Free trial, no card required" },
  ];

  return (
    <section className="border-y border-zinc-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {displayStats.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              {loading ? (
                <div className="mx-auto h-8 w-24 animate-pulse rounded bg-zinc-100" />
              ) : (
                <p className="text-3xl font-extrabold text-zinc-900">
                  {stat.number}
                </p>
              )}
              <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
