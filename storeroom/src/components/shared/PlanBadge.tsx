"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface PlanBadgeProps {
  plan: string;
  subscriptionStatus: string;
  subscriptionExpiry: string | null;
}

export default function PlanBadge({
  plan,
  subscriptionStatus,
  subscriptionExpiry,
}: PlanBadgeProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isActive = subscriptionStatus === "ACTIVE";
  const isPro = plan === "PRO";

  let badgeColor = "";
  let badgeIcon = null;
  let badgeText = "";

  if (!isActive) {
    badgeColor =
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800";
    badgeIcon = <AlertCircle className="mr-1 h-3 w-3" />;
    badgeText = "EXPIRED";
  } else if (isPro) {
    badgeColor =
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800";
    badgeIcon = <CheckCircle2 className="mr-1 h-3 w-3" />;
    badgeText = "PRO";
  } else {
    badgeColor =
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800";
    badgeIcon = <XCircle className="mr-1 h-3 w-3" />;
    badgeText = "FREE";
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge className={`px-3 py-1 text-xs font-semibold ${badgeColor}`}>
        {badgeIcon}
        {badgeText}
      </Badge>

      {subscriptionExpiry && (
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {isActive ? "Expires:" : "Expired:"}{" "}
            {formatDate(subscriptionExpiry)}
          </span>
        </div>
      )}
    </div>
  );
}
