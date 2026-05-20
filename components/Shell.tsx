import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { logoutAction } from "@/app/login/actions";

type StudentNav =
  | "dashboard"
  | "chat"
  | "sessions"
  | "doubts"
  | "resources"
  | "profile";
type MentorNav =
  | "dashboard"
  | "students"
  | "doubts"
  | "calendar"
  | "resources"
  | "earnings";
type AdminNav =
  | "dashboard"
  | "students"
  | "mentors"
  | "sessions"
  | "payments"
  | "analytics"
  | "settings"
  | "audit";

interface ShellProps {
  role: "student" | "mentor" | "admin";
  active: StudentNav | MentorNav | AdminNav;
  pageCode: string;
  pageTitle: string;
  pageSubtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const NAV = {
  student: [
    { key: "dashboard", label: "Dashboard", href: "/student/dashboard", icon: "◐" },
    { key: "chat", label: "Mentor Chat", href: "/student/chat", icon: "✎" },
    { key: "sessions", label: "Sessions", href: "/student/sessions", icon: "▢" },
    { key: "doubts", label: "Doubts", href: "/student/doubts", icon: "?" },
    { key: "resources", label: "Resources", href: "/student/resources", icon: "❒" },
    { key: "profile", label: "Profile", href: "/student/profile", icon: "◉" },
  ],
  mentor: [
    { key: "dashboard", label: "Dashboard", href: "/mentor/dashboard", icon: "◐" },
    { key: "students", label: "My Students", href: "/mentor/students", icon: "◉" },
    { key: "doubts", label: "Doubt Inbox", href: "/mentor/doubts", icon: "?" },
    { key: "calendar", label: "Calendar", href: "/mentor/calendar", icon: "▦" },
    { key: "resources", label: "Resources", href: "/mentor/resources", icon: "❒" },
    { key: "earnings", label: "Earnings", href: "/mentor/earnings", icon: "₹" },
  ],
  admin: [
    { key: "dashboard", label: "Overview", href: "/admin/dashboard", icon: "◐" },
    { key: "students", label: "Students", href: "/admin/students", icon: "◉" },
    { key: "mentors", label: "Mentors", href: "/admin/mentors", icon: "◎" },
    { key: "sessions", label: "Sessions", href: "/admin/sessions", icon: "▢" },
    { key: "payments", label: "Payments", href: "/admin/payments", icon: "₹" },
    { key: "analytics", label: "Analytics", href: "/admin/analytics", icon: "▦" },
    { key: "settings", label: "Settings", href: "/admin/settings", icon: "⚙" },
    { key: "audit", label: "Audit Log", href: "/admin/audit", icon: "📜" },
  ],
} as const;

const ROLE_LABEL = {
  student: "Student",
  mentor: "Mentor",
  admin: "Admin",
};

export async function Shell({
  role,
  active,
  pageCode,
  pageTitle,
  pageSubtitle,
  actions,
  children,
}: ShellProps) {
  const items = NAV[role];
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-surface text-ink">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-screen">
        <aside
          aria-label={`${ROLE_LABEL[role]} navigation`}
          className="hidden md:flex flex-col justify-between bg-surface-card border-r border-rule"
        >
          <div>
            <div className="px-6 py-6 border-b border-rule">
              <Link
                href={`/${role}/dashboard`}
                className="font-serif text-2xl font-medium text-primary-deep"
              >
                MentorIIT
              </Link>
              <div className="meta mt-1">{ROLE_LABEL[role]} portal</div>
            </div>
            <nav className="px-3 py-4 flex flex-col gap-0.5">
              {items.map((item) => {
                const isActive = item.key === active;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm transition-colors ${
                      isActive
                        ? "bg-primary-soft text-primary-deep font-medium"
                        : "text-ink-soft hover:bg-surface-elevated"
                    }`}
                  >
                    <span className="w-5 text-center" aria-hidden>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          {user && (
            <div className="px-4 py-4 border-t border-rule flex items-center gap-3">
              <div className="avatar">
                {(user.fullName || user.email).slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.fullName}</div>
                <div className="text-xs text-ink-faint truncate">{user.email}</div>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-xs text-ink-faint hover:text-primary-deep underline underline-offset-2"
                  aria-label="Sign out"
                >
                  Exit
                </button>
              </form>
            </div>
          )}
        </aside>

        <section className="flex flex-col min-w-0">
          <header className="bg-surface-card border-b border-rule px-6 md:px-10 py-5 flex items-start justify-between gap-4">
            <div>
              <div className="meta">{pageCode}</div>
              <h1 className="font-serif text-2xl md:text-3xl mt-1 leading-tight">
                {pageTitle}
              </h1>
              {pageSubtitle && (
                <p className="text-sm text-ink-soft mt-1 max-w-[70ch]">
                  {pageSubtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">{actions}</div>
          </header>

          <div className="flex-1 px-4 md:px-10 py-6 md:py-8 max-w-container w-full">
            {children}
          </div>
        </section>

        <nav
          aria-label={`${ROLE_LABEL[role]} navigation mobile`}
          className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-card border-t border-rule
                     flex justify-around py-2 z-10"
        >
          {items.slice(0, 5).map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center gap-1 px-2 py-1 text-[10px] ${
                  isActive ? "text-primary-deep font-medium" : "text-ink-faint"
                }`}
              >
                <span className="text-base" aria-hidden>
                  {item.icon}
                </span>
                <span className="uppercase tracking-wider font-mono">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
