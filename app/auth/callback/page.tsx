"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Completing Google Sign In...");

  useEffect(() => {
    async function handleCallback() {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) {
          throw new Error("Missing Supabase env vars.");
        }

        // Fresh client — do NOT auto-detect session from URL (we handle it manually)
        const client = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        });

        // Exchange the auth code from the URL for a session
        const { data: { session }, error } = await client.auth.getSession();

        if (error) throw error;
        if (!session) {
          throw new Error("No active Supabase session found.");
        }

        const user = session.user;

        // Create local session cookie
        const res = await fetch("/api/onboarding/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: user.email,
            fullName: user.user_metadata?.full_name || user.email?.split("@")[0],
            avatarUrl: user.user_metadata?.avatar_url || "",
            supabaseAccessToken: session.access_token,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Session creation failed.");
        }

        const dashboardUrl = `/${data.role}/dashboard`;

        if (window.opener) {
          // Popup mode: notify parent and close
          setStatus("Signed in successfully! Closing window...");
          window.opener.postMessage(
            { type: "GOOGLE_AUTH_SUCCESS", role: data.role },
            window.location.origin
          );
          window.close();
        } else {
          // Full-tab mode: redirect user
          window.location.href = dashboardUrl;
        }
      } catch (err: any) {
        console.error("OAuth callback error:", err);
        setStatus(`Authentication failed: ${err.message}`);

        if (window.opener) {
          window.opener.postMessage(
            { type: "GOOGLE_AUTH_FAILURE", error: err.message },
            window.location.origin
          );
        } else {
          // Full-tab mode: redirect back to login with error
          const loginUrl = "/login?error=" + encodeURIComponent(err.message);
          setTimeout(() => {
            window.location.href = loginUrl;
          }, 2000);
        }
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-sm w-full space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Connecting Account</h2>
        <p className="text-xs text-slate-500 leading-relaxed">{status}</p>
      </div>
    </div>
  );
}
