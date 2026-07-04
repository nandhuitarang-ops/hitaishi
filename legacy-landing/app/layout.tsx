import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { IntroClipMount as IntroClip } from "@/components/intro/IntroClipMount";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Hitaishi — Your Wellwisher in the JEE Journey",
  description:
    "Hitaishi pairs JEE aspirants with IITian and top-ranker mentors — 1-on-1, online, flexible. Built for students, mentors, and coaching institutions in India.",
  metadataBase: new URL("https://hitaishi.in"),
  openGraph: {
    title: "Hitaishi — Your Wellwisher in the JEE Journey",
    description:
      "Personal IIT/NIT mentors for every JEE aspirant. Flexible, online, around your coaching.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playfair.variable} antialiased bg-[var(--color-background)]`}
    >
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-fg)] flex flex-col">
        <MotionProvider>
          <IntroClip />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
