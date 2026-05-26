"use client";

import { MessageCircle } from "lucide-react";
import { useMe } from "@/hooks/Useme";

export default function WhatsAppSupport() {
  const { me } = useMe();

  // Only show for PRO users (not during trial)
  const isPro = me?.organization?.plan === "PRO";

  // Don't show for FREE or trial users
  if (!isPro) return null;

  const openWhatsApp = () => {
    // Get user info for dynamic message
    const userName = me?.name || "Storeroom User";
    const userEmail = me?.email || "";
    const organizationName = me?.organization?.organizationName || "";
    const userRole = me?.role || "";

    // Get current page URL
    const currentPage =
      typeof window !== "undefined" ? window.location.pathname : "";

    // Current timestamp
    const timestamp = new Date().toLocaleString();

    // Create dynamic message
    const message = `Hello Storeroom Support! 👋

I need help with the following:

📋 User Information:
• Name: ${userName}
• Email: ${userEmail}
• Role: ${userRole}
• Organization: ${organizationName}

📍 Page: ${currentPage}
🕐 Time: ${timestamp}

━━━━━━━━━━━━━━━━━━━━
Please describe your issue below:
━━━━━━━━━━━━━━━━━━━━

Issue: `;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp number (replace with your actual number)
    const phoneNumber = "233257031581"; // e.g., "233241234567"

    // Open WhatsApp
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank",
    );
  };

  return (
    <button
      onClick={openWhatsApp}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition-all hover:bg-green-600 hover:scale-110 active:scale-95"
      aria-label="WhatsApp Support"
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </button>
  );
}
