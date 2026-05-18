import { Shell } from "@/components/Shell";
import { formatInr } from "@/lib/format";

const monthlyRevenue = [
  { m: "Dec", v: 2 },
  { m: "Jan", v: 5 },
  { m: "Feb", v: 9 },
  { m: "Mar", v: 14 },
  { m: "Apr", v: 22 },
  { m: "May", v: 31 },
];

const retention = [
  { week: "W1", pct: 100 },
  { week: "W2", pct: 92 },
  { week: "W3", pct: 87 },
  { week: "W4", pct: 84 },
  { week: "W8", pct: 78 },
  { week: "W12", pct: 71 },
];

const mentorPerformance = [
  { id: "m1", name: "Rohan Kapoor", students: 5, npsAvg: 4.8, replyHrs: 3.2, status: "ok" },
  { id: "m2", name: "Priya Mehta", students: 4, npsAvg: 4.6, replyHrs: 8.1, status: "ok" },
  { id: "m3", name: "Vikram Sahu", students: 3, npsAvg: 3.9, replyHrs: 22.4, status: "watch" },
];

const totalRevenue = monthlyRevenue.reduce((a, b) => a + b.v, 0) * 1_499_900;

function Bar({ data, max }: { data: { m: string; v: number }[]; max: number }) {
  return (
    <div className="flex items-end gap-3 h-40 mt-3">
      {data.map((d) => (
        <div key={d.m} className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-full bg-[var(--ink)] transition-all"
            style={{ height: `${(d.v / max) * 100}%` }}
            aria-label={`${d.m}: ${d.v}`}
          />
          <div className="meta">{d.m}</div>
        </div>
      ))}
    </div>
  );
}

function Line({ data }: { data: { week: string; pct: number }[] }) {
  const w = 100 / (data.length - 1);
  const points = data.map((d, i) => `${i * w},${100 - d.pct}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-40 mt-3">
      <polyline points={points} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      {data.map((d, i) => (
        <circle key={d.week} cx={i * w} cy={100 - d.pct} r="1.5" fill="var(--ink)" />
      ))}
    </svg>
  );
}

export default function AdminAnalytics() {
  return (
    <Shell role="admin" active="analytics" pageCode="A.06 — Analytics" pageTitle="The two numbers that matter.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article>
          <div className="meta">Revenue · cumulative {formatInr(totalRevenue)}</div>
          <div className="serif text-3xl font-bold mt-1">
            {formatInr(monthlyRevenue[monthlyRevenue.length - 1].v * 1_499_900)}
          </div>
          <div className="text-xs text-[var(--ink-soft)] mt-1">this month · {monthlyRevenue[monthlyRevenue.length - 1].v} new students</div>
          <Bar data={monthlyRevenue} max={Math.max(...monthlyRevenue.map((m) => m.v))} />
        </article>

        <article>
          <div className="meta">Retention · cohort May</div>
          <div className="serif text-3xl font-bold mt-1">{retention[retention.length - 1].pct}%</div>
          <div className="text-xs text-[var(--ink-soft)] mt-1">still active at W12</div>
          <Line data={retention} />
          <div className="flex justify-between meta mt-2">
            {retention.map((r) => <span key={r.week}>{r.week}</span>)}
          </div>
        </article>
      </div>

      <section>
        <div className="meta mb-3">Mentor performance</div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-[var(--ink)]">
              <th className="text-left py-3 meta">Mentor</th>
              <th className="text-right py-3 meta">Students</th>
              <th className="text-right py-3 meta">NPS avg</th>
              <th className="text-right py-3 meta">Reply (hrs)</th>
              <th className="text-right py-3 meta">Status</th>
            </tr>
          </thead>
          <tbody>
            {mentorPerformance.map((m) => (
              <tr key={m.id} className="border-b border-[var(--rule)]">
                <td className="py-3 font-medium">{m.name}</td>
                <td className="py-3 text-right">{m.students}</td>
                <td className="py-3 text-right serif font-bold">{m.npsAvg}</td>
                <td className="py-3 text-right">{m.replyHrs}</td>
                <td className="py-3 text-right">
                  {m.status === "watch" ? (
                    <span className="px-2 py-0.5 text-xs border border-[var(--signal)] bg-[var(--signal-soft)]">
                      Watch
                    </span>
                  ) : (
                    <span className="meta">OK</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Shell>
  );
}
