import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  description:
    "Browse Indian credit cards ranked by profile fit and estimated personal value. Compare joining and annual fees, rewards, lounge access and forex markup.",
  path: "/cards",
  title: "Credit Cards in India — Compare Fees & Value | Credlytic"
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
