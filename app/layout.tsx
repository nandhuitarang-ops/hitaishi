import "./globals.css";
import { Bodoni_Moda, DM_Sans } from "next/font/google";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dm = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "MentorIIT",
  description: "Private mentorship for JEE/IIT aspirants",
  manifest: "/manifest.json",
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${dm.variable}`}>
      <body>{children}</body>
    </html>
  );
}
