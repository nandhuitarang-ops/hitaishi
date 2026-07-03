function StudentFallbackSVG() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="50" y="80" width="100" height="75" rx="6" fill="var(--color-primary-soft)" stroke="var(--color-primary)" strokeWidth="1.5" />
      <rect x="58" y="88" width="84" height="4" rx="2" fill="var(--color-primary)" opacity="0.3" />
      <rect x="58" y="96" width="60" height="4" rx="2" fill="var(--color-primary)" opacity="0.2" />
      <rect x="58" y="104" width="72" height="4" rx="2" fill="var(--color-primary)" opacity="0.15" />
      <polygon points="100,30 60,55 100,70 140,55" fill="var(--color-primary)" opacity="0.8" />
      <rect x="97" y="55" width="6" height="25" fill="var(--color-primary)" opacity="0.6" />
      <circle cx="100" cy="28" r="4" fill="var(--color-secondary)" />
      <circle cx="40" cy="50" r="3" fill="var(--color-secondary)" opacity="0.5" />
      <circle cx="160" cy="40" r="2.5" fill="var(--color-primary)" opacity="0.4" />
      <circle cx="155" cy="120" r="2" fill="var(--color-secondary)" opacity="0.3" />
    </svg>
  );
}

function MentorFallbackSVG() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="40" y="50" width="120" height="90" rx="8" fill="white" stroke="var(--color-primary)" strokeWidth="1.5" />
      <line x1="55" y1="75" x2="145" y2="75" stroke="var(--color-primary)" strokeWidth="1" opacity="0.3" />
      <line x1="55" y1="90" x2="120" y2="90" stroke="var(--color-secondary)" strokeWidth="1" opacity="0.3" />
      <line x1="55" y1="105" x2="135" y2="105" stroke="var(--color-primary)" strokeWidth="1" opacity="0.2" />
      <line x1="100" y1="140" x2="100" y2="175" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="30" r="12" fill="var(--color-secondary-soft)" stroke="var(--color-secondary)" strokeWidth="1.5" />
      <path d="M95 28 L100 22 L105 28" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="100" y1="34" x2="100" y2="40" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="30" cy="80" r="3" fill="var(--color-secondary)" opacity="0.4" />
      <circle cx="170" cy="70" r="2.5" fill="var(--color-primary)" opacity="0.3" />
    </svg>
  );
}

function AdminFallbackSVG() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="30" y="40" width="140" height="110" rx="10" fill="white" stroke="var(--color-primary)" strokeWidth="1.5" />
      <rect x="50" y="100" width="16" height="35" rx="3" fill="var(--color-primary)" opacity="0.7" />
      <rect x="72" y="85" width="16" height="50" rx="3" fill="var(--color-secondary)" opacity="0.7" />
      <rect x="94" y="70" width="16" height="65" rx="3" fill="var(--color-primary)" opacity="0.5" />
      <rect x="116" y="90" width="16" height="45" rx="3" fill="var(--color-secondary)" opacity="0.5" />
      <rect x="138" y="75" width="16" height="60" rx="3" fill="var(--color-primary)" opacity="0.3" />
      <circle cx="80" cy="60" r="12" fill="var(--color-primary-soft)" stroke="var(--color-primary)" strokeWidth="1" />
      <path d="M80 48 A12 12 0 0 1 92 60 L80 60 Z" fill="var(--color-secondary)" />
      <circle cx="140" cy="55" r="8" fill="var(--color-primary-soft)" stroke="var(--color-primary)" strokeWidth="1.5" />
      <circle cx="140" cy="55" r="3" fill="white" />
    </svg>
  );
}

import React from "react";

const FALLBACK_SVGS: Record<string, () => React.ReactNode> = {
  student: StudentFallbackSVG,
  mentor: MentorFallbackSVG,
  admin: AdminFallbackSVG,
};

interface LoginIllustrationProps {
  role: "student" | "mentor" | "admin";
}

export function LoginIllustration({ role }: LoginIllustrationProps) {
  const FallbackComponent = FALLBACK_SVGS[role] ?? StudentFallbackSVG;

  return (
    <div className="w-full max-w-[280px] mx-auto aspect-square flex items-center justify-center opacity-90">
      <FallbackComponent />
    </div>
  );
}
