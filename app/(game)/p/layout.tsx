import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false } };

/** Shared profile links stay out of search results. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
