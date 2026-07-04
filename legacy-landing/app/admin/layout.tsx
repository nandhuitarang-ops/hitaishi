import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminFooter } from "@/components/admin/AdminFooter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin · Leads · Hitaishi",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} antialiased bg-[var(--color-background)]`}>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-fg)] flex flex-col">
        <AdminHeader />
        <main className="flex-1 flex flex-col pt-24 md:pt-28">{children}</main>
        <AdminFooter />
      </body>
    </html>
  );
}
