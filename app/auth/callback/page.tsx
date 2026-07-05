"use client";

import { useEffect, useState } from "react";
import { getAuthClient } from "@/lib/supabase/auth-client";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Completing Google Sign In...");

  useEffect(() => {
    async function handleCallback() {
      try {
        const client = getAuthClient();

        // Supabase auth client with detectSessionInUrl:true automatically
        // exchanges the PKCE code or reads the access_token from the URL
        const { data: { session }, error } = await client.auth.getSession();

        if (error) throw error;
        if (!session) {
          throw new Error("No active Supabase session found.");
        }

        const user = session.user;
        setStatus("Creating your session...");

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

        if (window.opener) {
          setStatus("Signed in successfully!");
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_SUCCESS",
              role: data.role,
              user: {
                email: user.email,
                fullName: user.user_metadata?.full_name || user.email?.split("@")[0],
                avatarUrl: user.user_metadata?.avatar_url || "",
              },
            },
            "*"
          );
          window.close();
        } else {
          window.location.href = `/${data.role}/dashboard`;
        }
      } catch (err: any) {
        console.error("OAuth callback error:", err);
        setStatus(`Authentication failed: ${err.message}`);

        if (window.opener) {
          window.opener.postMessage(
            { type: "GOOGLE_AUTH_FAILURE", error: err.message },
            "*"
          );
        } else {
          window.location.href = "/login?error=" + encodeURIComponent(err.message);
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
