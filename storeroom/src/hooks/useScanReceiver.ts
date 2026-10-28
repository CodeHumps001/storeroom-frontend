"use client";

import { useEffect, useRef, useState } from "react";
import { getToken } from "@/lib/auth";

/**
 * Listens for scans a paired phone sends to this POS screen.
 * Uses fetch streaming (not EventSource) so the normal Bearer token header works.
 * Reconnects automatically with backoff.
 */
export function useScanReceiver(
  channel: string | null,
  onScan: (value: string) => void,
) {
  const [connected, setConnected] = useState(false);
  const handlerRef = useRef(onScan);
  handlerRef.current = onScan;

  useEffect(() => {
    if (!channel) return;
    const ctrl = new AbortController();
    let attempt = 0;

    const run = async () => {
      while (!ctrl.signal.aborted) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/scan/stream?channel=${encodeURIComponent(channel)}`,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
                Accept: "text/event-stream",
              },
              signal: ctrl.signal,
            },
          );
          if (res.status === 401) return; // logged out, stop retrying
          if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

          setConnected(true);
          attempt = 0;

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split("\n\n");
            buffer = events.pop() ?? "";

            for (const ev of events) {
              const line = ev.split("\n").find((l) => l.startsWith("data:"));
              if (!line) continue; // heartbeat comments start with ":"
              try {
                const msg = JSON.parse(line.slice(5).trim());
                if (msg.type === "scan" && msg.value) {
                  handlerRef.current(String(msg.value));
                }
              } catch {
                /* ignore malformed event */
              }
            }
          }
        } catch {
          if (ctrl.signal.aborted) return;
        }
        setConnected(false);
        await new Promise((r) =>
          setTimeout(r, Math.min(1000 * 2 ** attempt++, 15000)),
        );
      }
    };

    run();
    return () => {
      ctrl.abort();
      setConnected(false);
    };
  }, [channel]);

  return { connected };
}