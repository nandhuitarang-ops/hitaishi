"use client";

import { useEffect, useState } from "react";
import { getAuthClient } from "@/lib/supabase/auth-client";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Completing Google Sign In...");

  useEffect(() => {
    async function handleCallback() {
      try {
        const client = getAuthClient();

        // Let Supabase process the hashes/params from URL to establish a session
        const { data: { session }, error } = await client.auth.getSession();

        if (error) throw error;
        if (!session) {
          throw new Error("No active Supabase session found.");
        }

        const user = session.user;

        // Post the authenticated user details to our local session API
        const res = await fetch("/api/onboarding/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            fullName: user.user_metadata?.full_name || user.email?.split("@")[0],
            avatarUrl: user.user_metadata?.avatar_url || "",
            supabaseAccessToken: session.access_token,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Session creation failed.");

        setStatus("Signed in successfully! Closing window...");

        // Notify the parent onboarding page
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_SUCCESS",
              user: {
                email: user.email,
                fullName: user.user_metadata?.full_name || user.email?.split("@")[0],
              },
            },
            window.location.origin
          );
        }

        // Close popup
        window.close();
      } catch (err: any) {
        console.error("OAuth callback error:", err);
        setStatus(`Authentication failed: ${err.message}`);
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_FAILURE",
              error: err.message,
            },
            window.location.origin
          );
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
