import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false } };

/** Circle pages (join links, role invites, circle admin) stay out of search results. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
