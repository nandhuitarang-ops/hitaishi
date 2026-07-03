"use client";

import { useEffect, useState } from "react";
import { getAuthClient } from "@/lib/supabase/auth-client";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Completing Google Sign In...");

  useEffect(() => {
    async function handleCallback() {
      try {
        // Use the singleton auth client (shares localStorage for PKCE code verifier)
        const client = getAuthClient();

        // Supabase v2 uses PKCE by default: the URL contains ?code=...
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const errorDesc = url.searchParams.get("error_description");

        if (errorDesc) {
          throw new Error(`OAuth error: ${errorDesc}`);
        }

        if (code) {
          setStatus("Exchanging auth code for session...");
          const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw new Error(`Code exchange failed: ${exchangeError.message}`);
          }
        }

        // Now get the established session (works for both PKCE and implicit grant)
        setStatus("Retrieving session...");
        const { data: { session }, error: sessionError } = await client.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session) {
          throw new Error(
            "No active Supabase session found. " +
            "The auth code may have expired, been used already, or the OAuth flow was interrupted."
          );
        }

        const user = session.user;
        setStatus("Creating local session...");

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
          }, 3000);
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
