import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import TransitionLoader from "@/components/TransitionLoader";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { IntroClipMount as IntroClip } from "@/components/intro/IntroClipMount";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hitaishi — Your Wellwisher in the JEE Journey",
  description:
    "Hitaishi pairs JEE aspirants with IITian and top-ranker mentors — 1-on-1, online, flexible. Built for students, mentors, and coaching institutions in India.",
  metadataBase: new URL("https://hitaishi.in"),
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo-icon-transparent.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hitaishi",
  },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            if (window.location.hash && window.location.hash.includes('access_token=') && window.location.pathname !== '/auth/callback') {
              window.location.href = '/auth/callback' + window.location.hash;
            }
          } catch (e) {
            console.error(e);
          }
        ` }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <script type="speculationrules" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            prerender: [{
              where: {
                href_matches: "/*",
                not: { href_matches: ["/admin/*", "/student/*", "/mentor/*", "/api/*", "/session/*"] }
              },
              eagerness: "moderate"
            }]
          })
        }} />
        <MotionProvider>
          <IntroClip />
          <Suspense fallback={null}>
            <TransitionLoader />
          </Suspense>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}

