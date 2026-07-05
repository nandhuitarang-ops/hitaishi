"use client";

import { useState } from "react";

export default function GoogleSimPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [step, setStep] = useState(1); // 1 = select/enter email, 2 = enter name/password, 3 = loading
  const [error, setError] = useState<string | null>(null);

  const mockAccounts = [
    { name: "Arjun Srinivasan", email: "arjun.sri@gmail.com", avatar: "AS" },
    { name: "Priya Sharma", email: "priya.sharma@outlook.com", avatar: "PS" },
  ];

  const handleAccountClick = (acc: typeof mockAccounts[0]) => {
    setEmail(acc.email);
    setFullName(acc.name);
    proceedWithAuth(acc.email, acc.name);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep(2);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;
    proceedWithAuth(email, fullName);
  };

  const proceedWithAuth = async (targetEmail: string, name: string) => {
    setStep(3);
    setError(null);
    try {
      const res = await fetch("/api/onboarding/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          fullName: name,
          avatarUrl: "",
          supabaseAccessToken: "mock-oauth-token-12345",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create local session.");

      if (window.opener) {
        window.opener.postMessage(
          {
            type: "GOOGLE_AUTH_SUCCESS",
            user: {
              email: targetEmail,
              fullName: name,
            },
          },
          "*"
        );
      }
      
      setTimeout(() => {
        window.close();
      }, 500);
    } catch (err: any) {
      setError(err.message);
      setStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-[#202124]">
      <div className="bg-white border border-[#dadce0] rounded-lg max-w-[450px] w-full p-8 md:p-10 space-y-6 shadow-sm">
        {/* Google Logo */}
        <div className="flex justify-center mb-2">
          <svg className="w-[74px] h-6" viewBox="0 0 74 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.7 15.5c-3.7 0-6.7-3-6.7-6.7S4 2.1 7.7 2.1c2 0 3.8.8 5.1 2.2l-1.8 1.8C10.1 5 8.9 4.5 7.7 4.5c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4c1.5 0 2.6-.7 3.2-1.7.5-.9.7-2 .7-3.1H7.7v-2.4h6.5c0 .3.1.7.1 1.1 0 1.9-.5 3.9-1.7 5.1-1.2 1.3-2.9 2-4.9 2z" fill="#4285F4"/>
            <path d="M22.5 15.3c-3.4 0-6.1-2.6-6.1-6s2.7-6 6.1-6c3.4 0 6.1 2.6 6.1 6s-2.7 6-6.1 6zm0-2.4c2.1 0 3.7-1.7 3.7-3.6s-1.6-3.6-3.7-3.6c-2.1 0-3.7 1.7-3.7 3.6s1.6 3.6 3.7 3.6z" fill="#EA4335"/>
            <path d="M36.5 15.3c-3.4 0-6.1-2.6-6.1-6s2.7-6 6.1-6c3.4 0 6.1 2.6 6.1 6s-2.7 6-6.1 6zm0-2.4c2.1 0 3.7-1.7 3.7-3.6s-1.6-3.6-3.7-3.6c-2.1 0-3.7 1.7-3.7 3.6s1.6 3.6 3.7 3.6z" fill="#FBBC05"/>
            <path d="M50.3 15.3c-3.3 0-5.9-2.6-5.9-6s2.6-6 5.9-6c1.6 0 2.9.6 3.9 1.6l-1.6 1.6c-.7-.7-1.5-1.1-2.3-1.1-2 0-3.5 1.7-3.5 3.8s1.5 3.8 3.5 3.8c1.3 0 2.1-.5 2.6-1 .4-.4.8-1.1.9-2h-3.5v-2.3h5.9c.1.3.1.6.1.9 0 1.9-.5 4-1.8 5.2-1.2 1.3-2.8 1.8-4.2 1.8z" fill="#4285F4"/>
            <path d="M59.3 22.8V2.6h2.4v20.2h-2.4z" fill="#34A853"/>
            <path d="M68.7 15.3c-3.2 0-5.8-2.5-5.8-6 0-3.6 2.5-6 5.8-6 3.1 0 5.4 2.3 5.4 6 0 .4 0 .7-.1.9H65.3c.2 1.8 1.6 2.7 3.3 2.7 1.3 0 2.4-.6 3-1.5l2 1.3c-.9 1.6-2.9 2.6-5.3 2.6zm-3.3-8h6.4c-.1-1.4-1.2-2.5-2.9-2.5-1.7 0-3 1.2-3.5 2.5z" fill="#EA4335"/>
          </svg>
        </div>

        {/* Heading */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-normal text-[#202124]">Sign in</h1>
          <p className="text-sm text-[#5f6368]">to continue to Hitaishi</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-100">
            {error}
          </div>
        )}

        {/* STEP 1: Select or enter email */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="border border-[#dadce0] rounded-md divide-y divide-[#dadce0] overflow-hidden">
              {mockAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleAccountClick(acc)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-[#5f6368]">
                    {acc.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{acc.name}</p>
                    <p className="text-xs text-[#5f6368] truncate">{acc.email}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-[#dadce0]" />
              <span className="text-xs text-[#5f6368]">or enter details</span>
              <div className="flex-1 h-px bg-[#dadce0]" />
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-3.5 py-3 border border-[#dadce0] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none rounded text-sm transition-all placeholder:text-[#5f6368]"
              />
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.opener) {
                      window.opener.postMessage({ type: "GOOGLE_AUTH_FAILURE", error: "User cancelled login." }, window.location.origin);
                    }
                    window.close();
                  }}
                  className="text-sm font-semibold text-[#1a73e8] hover:text-[#1557b0] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-semibold rounded transition-colors shadow-sm"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Name details */}
        {step === 2 && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div className="text-sm font-medium mb-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[#5f6368] hover:text-black"
              >
                ←
              </button>
              <span>{email}</span>
            </div>

            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3.5 py-3 border border-[#dadce0] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none rounded text-sm transition-all placeholder:text-[#5f6368]"
            />
            <input
              type="password"
              placeholder="Password (mock)"
              className="w-full px-3.5 py-3 border border-[#dadce0] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none rounded text-sm transition-all placeholder:text-[#5f6368]"
            />

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-semibold text-[#1a73e8] hover:text-[#1557b0] transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-semibold rounded transition-colors shadow-sm"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Loading text only */}
        {step === 3 && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <p className="text-sm font-medium text-[#5f6368]">Signing you in securely...</p>
          </div>
        )}

        {/* Google Terms Footer */}
        <div className="flex justify-between text-xs text-[#5f6368] pt-6 border-t border-[#f1f3f4]">
          <span>English (United States)</span>
          <div className="space-x-3">
            <a href="#" className="hover:underline">Help</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}
