import { describe, it, expect } from "vitest";
import { scanMessage } from "./content-scanner";

describe("scanMessage", () => {
  it("returns clean=true for innocuous messages", () => {
    const r = scanMessage("Can you review my rotational mechanics doubt?");
    expect(r.clean).toBe(true);
    expect(r.flags).toEqual([]);
  });

  it("flags Indian phone numbers (10-digit and +91)", () => {
    expect(scanMessage("call me at 9876543210").flags).toContain("phone");
    expect(scanMessage("+91 98765 43210").flags).toContain("phone");
    expect(scanMessage("my no is 09876543210").flags).toContain("phone");
  });

  it("flags personal emails", () => {
    expect(scanMessage("mail me at foo@gmail.com").flags).toContain("email");
  });

  it("flags 'meet outside platform' patterns", () => {
    const phrases = [
      "let's meet outside the platform",
      "we can talk on whatsapp",
      "DM me on telegram",
      "contact me via instagram dm",
      "let's continue on signal",
    ];
    for (const p of phrases) {
      const r = scanMessage(p);
      expect(r.flags).toContain("off_platform");
    }
  });

  it("returns multiple flags when multiple patterns present", () => {
    const r = scanMessage("whatsapp me on 9876543210");
    expect(r.flags).toContain("phone");
    expect(r.flags).toContain("off_platform");
    expect(r.clean).toBe(false);
  });

  it("ignores phone-like numbers that are clearly not phone numbers (years, scores)", () => {
    expect(scanMessage("I scored 199 in JEE Mains 2025").flags).not.toContain(
      "phone",
    );
  });

  it("is case-insensitive", () => {
    expect(scanMessage("WHATSAPP me").flags).toContain("off_platform");
    expect(scanMessage("Email: STUDENT@GMAIL.COM").flags).toContain("email");
  });

  it("handles empty / whitespace input safely", () => {
    expect(scanMessage("").clean).toBe(true);
    expect(scanMessage("   ").clean).toBe(true);
  });
});
