import type { Metadata } from "next";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Student Portal — Hitaishi",
  robots: "noindex, nofollow",
};

export default function Page() {
  return <PageContent />;
}
