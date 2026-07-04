import type { Metadata } from "next";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Pricing — Hitaishi",
  description: "Affordable mentorship plans for JEE aspirants.",
};

export default function Page() {
  return <PageContent />;
}
