import { requireRole } from "@/lib/session";

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  await requireRole("mentor");
  return <>{children}</>;
}
