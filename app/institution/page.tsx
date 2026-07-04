import type { Metadata } from "next";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "For Institutions — Hitaishi",
  description: "Partner with Hitaishi for institutional mentorship.",
};

export default function Page() {
  return <PageContent />;
}
