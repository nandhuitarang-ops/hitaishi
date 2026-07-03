"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export function RealtimeRefresher() {
  const router = useRouter();

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.warn(
        "[RealtimeRefresher] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — skipping realtime subscription."
      );
      return;
    }

    const supabase = createClient(url, key);

    // Subscribe to changes on key admin tables
    const tables = [
      "users",
      "profiles",
      "sessions",
      "mentor_verifications",
      "webhook_events",
      "conversations",
      "audit_log",
      "mentor_requests",
    ];

    const channels = tables.map((table) => {
      return supabase
        .channel(`admin-refresh-${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => {
            console.log(`[RealtimeRefresher] Database change in "${table}":`, payload.eventType);
            router.refresh();
          }
        )
        .subscribe();
    });

    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [router]);

  return null;
}
