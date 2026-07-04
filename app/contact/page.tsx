import type { Metadata } from "next";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Contact Us — Hitaishi",
  description: "Get in touch with the Hitaishi team.",
};

export default function Page() {
  return <PageContent />;
}
