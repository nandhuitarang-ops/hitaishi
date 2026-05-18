const INR_FMT = new Intl.NumberFormat("en-IN");

export function formatInr(paise: number): string {
  const rupees = Math.round(paise / 100);
  return `₹${INR_FMT.format(rupees)}`;
}

export function formatDayCounter(day: number, total: number): string {
  const clamped = Math.max(1, Math.min(day, total));
  return `Day ${clamped} of ${total}`;
}

export function formatTimeUntil(target: Date, now: Date = new Date()): string {
  const deltaMs = target.getTime() - now.getTime();
  const deltaMin = Math.floor(deltaMs / 60_000);

  if (deltaMin < -60) return "ended";
  if (deltaMin < 1) return "live now";
  if (deltaMin < 60) return `in ${deltaMin} min`;
  const deltaH = Math.floor(deltaMin / 60);
  if (deltaH < 23) return `in ${deltaH} hr${deltaH === 1 ? "" : "s"}`;
  return "tomorrow";
}

export function formatLastSeen(when: Date, now: Date = new Date()): string {
  const deltaS = Math.floor((now.getTime() - when.getTime()) / 1000);
  if (deltaS < 60) return "just now";
  const deltaMin = Math.floor(deltaS / 60);
  if (deltaMin < 60) return `${deltaMin}m ago`;
  const deltaH = Math.floor(deltaMin / 60);
  if (deltaH < 24) return `${deltaH}h ago`;
  if (deltaH < 48) return "yesterday";
  return `${Math.floor(deltaH / 24)}d ago`;
}

export function initials(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
