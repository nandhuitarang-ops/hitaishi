"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export function PayButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);

    await Promise.all([
      new Promise((r) => setTimeout(r, 2000)),
      fetch("/api/student/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "payment_completed" }),
      }).catch(() => {}),
    ]);

    router.push("/student/dashboard");
  }

  return (
    <Button size="lg" onClick={handlePay} disabled={loading}>
      {loading ? "Processing…" : "Pay ₹14,999 →"}
    </Button>
  );
}
