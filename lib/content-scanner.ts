export type ScanFlag = "phone" | "email" | "off_platform";

export interface ScanResult {
  clean: boolean;
  flags: ScanFlag[];
}

const EMAIL_RE = /([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})/gi;
const PLATFORM_DOMAIN = /@(hitaishi\.app|hitaishii\.com)$/i;
const EMAIL_INTENT_RE = /\b(mail|email|contact|reach|write|send)\b/i;

// Pre-extract digit runs (allowing spaces / dashes) then validate as an Indian mobile.
function hasIndianPhone(text: string): boolean {
  const runs = text.match(/(?:\+?\d[\d\s-]{8,}\d)/g);
  if (!runs) return false;
  for (const r of runs) {
    const digits = r.replace(/\D/g, "");
    const local = digits.startsWith("91") && digits.length === 12
      ? digits.slice(2)
      : digits.startsWith("0") && digits.length === 11
        ? digits.slice(1)
        : digits;
    if (local.length === 10 && /^[6-9]/.test(local)) return true;
  }
  return false;
}

function hasEscalatingEmail(text: string): boolean {
  const matches = text.matchAll(EMAIL_RE);
  for (const m of matches) {
    const full = m[0];
    if (PLATFORM_DOMAIN.test(full)) continue;
    if (EMAIL_INTENT_RE.test(text)) return true;
  }
  return false;
}

const OFF_PLATFORM_PHRASES = [
  /\bwhats\s*app\b/i,
  /\btelegram\b/i,
  /\binstagram\b/i,
  /\bsignal\b/i,
  /\bdiscord\b/i,
  /\bmeet\s+outside\b/i,
  /\boff\s*platform\b/i,
  // narrow DM rules — bare "dm" is too noisy for an education chat (dm/dt, dm:dx)
  /\bdm\s+me\b/i,
  /\bslide\s+into\s+my\s+dms?\b/i,
];

export function scanMessage(body: string): ScanResult {
  const flags: ScanFlag[] = [];
  const text = body ?? "";

  if (hasIndianPhone(text)) flags.push("phone");
  if (hasEscalatingEmail(text)) flags.push("email");
  if (OFF_PLATFORM_PHRASES.some((re) => re.test(text))) {
    flags.push("off_platform");
  }

  return { clean: flags.length === 0, flags };
}
