"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, LinkButton } from "@/components/ui";

interface Props {
  sessionId: string;
  meetLink: string | null;
  title: string;
  hostName: string;
  role: string;
}

export function ClientRedirector({ sessionId, meetLink, title, hostName, role }: Props) {
  const [status, setStatus] = useState<"scheduled" | "starting" | "live">("scheduled");
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    if (!meetLink) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/session/${sessionId}/status`);
        if (res.ok) {
          const data = await res.json();
          setStatus(data.status);
          setSecondsRemaining(data.secondsRemaining || 0);
          if (data.status === "live") {
            clearInterval(interval);
            window.location.href = meetLink;
          }
        }
      } catch (e) {
        // ignore
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [sessionId, meetLink]);

  return (
    <Card className="max-w-md w-full text-center p-8 border border-rule bg-surface-card shadow-lg">
      <CardBody className="space-y-6">
        <div className="w-16 h-16 rounded-full mx-auto bg-primary/10 flex items-center justify-center text-primary text-2xl animate-pulse">
          🗓️
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink mb-1">{title}</h1>
          <p className="text-sm text-ink-soft">
            Mentor: <strong>{hostName}</strong>
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-3 pt-2">
          {status === "starting" ? (
            <>
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-amber-700">Mentor has joined! Securing meeting room...</p>
              <p className="text-xs text-ink-soft max-w-[280px]">
                Redirecting you in <strong className="text-sm text-amber-700 font-mono">{secondsRemaining}s</strong>
              </p>
            </>
          ) : (
            <>
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-ink">Waiting for your mentor to join...</p>
              <p className="text-xs text-ink-soft max-w-[280px]">
                This page will automatically redirect to the Jitsi meeting once the mentor starts the call.
              </p>
            </>
          )}
        </div>
        
        <div className="pt-6 border-t border-rule">
          <LinkButton href={`/${role}/sessions`} variant="ghost" size="sm">
            ← Back to Sessions
          </LinkButton>
        </div>
      </CardBody>
    </Card>
  );
}
