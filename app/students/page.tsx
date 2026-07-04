import type { Metadata } from "next";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "For Students — Hitaishi",
  description: "Find your perfect IITian mentor.",
};

export default function Page() {
  return <PageContent />;
}
