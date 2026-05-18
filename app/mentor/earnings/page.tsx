import { Shell } from "@/components/Shell";
import { formatInr } from "@/lib/format";

const mockNextPayout = {
  amountPaise: 4_499_700,
  date: "30 May 2026",
  sessions: 18,
};

const mockHistory = [
  { id: "p1", period: "Apr 2026", gross: 5_200_000, fee: 1_040_000, tds: 0, net: 4_160_000 },
  { id: "p2", period: "Mar 2026", gross: 4_800_000, fee: 960_000, tds: 0, net: 3_840_000 },
];

export default function MentorEarnings() {
  return (
    <Shell role="mentor" active="earnings" pageCode="M.06 — Earnings" pageTitle="Your payouts.">
      <article className="border-l-4 border-[var(--signal)] pl-5 py-3">
        <div className="meta">Next payout · {mockNextPayout.date}</div>
        <div className="serif text-5xl font-bold mt-2">{formatInr(mockNextPayout.amountPaise)}</div>
        <div className="text-sm text-[var(--ink-soft)] mt-2">
          For {mockNextPayout.sessions} sessions this month. Razorpay Routes transfers to your verified bank account.
        </div>
      </article>

      <section>
        <div className="meta mb-3">Statement history</div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-[var(--ink)]">
              <th className="text-left py-3 meta">Period</th>
              <th className="text-right py-3 meta">Gross</th>
              <th className="text-right py-3 meta hidden md:table-cell">Platform fee</th>
              <th className="text-right py-3 meta hidden md:table-cell">TDS</th>
              <th className="text-right py-3 meta">Net</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map((p) => (
              <tr key={p.id} className="border-b border-[var(--rule)]">
                <td className="py-3">{p.period}</td>
                <td className="py-3 text-right">{formatInr(p.gross)}</td>
                <td className="py-3 text-right hidden md:table-cell text-[var(--ink-soft)]">− {formatInr(p.fee)}</td>
                <td className="py-3 text-right hidden md:table-cell text-[var(--ink-soft)]">− {formatInr(p.tds)}</td>
                <td className="py-3 text-right serif font-bold">{formatInr(p.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="meta">Tax docs ship with v2 · full TDS workflow under design</p>
    </Shell>
  );
}
