import type { Metadata } from "next";
import { ShowcasePage } from "@/components/showcase/showcase-page";

export const metadata: Metadata = {
  title: "Showcase",
  description:
    "A dense, screenshot-friendly snapshot of the AgroDash product surface — sidebar, KPIs, analytics and activity in a single viewport.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ShowcasePage />;
}
