import type { Metadata, Viewport } from "next";
import { Google_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Google Sans for text and UI, Clash Display for headings and big numbers.
const googleSans = Google_Sans({
  subsets: ["latin"],
  variable: "--font-google-sans",
  display: "swap",
});

// Clash Display (Fontshare, ITF Free Font License).
const clashDisplay = localFont({
  src: [
    { path: "./fonts/clash-display/ClashDisplay-500.woff2", weight: "500" },
    { path: "./fonts/clash-display/ClashDisplay-600.woff2", weight: "600" },
    { path: "./fonts/clash-display/ClashDisplay-700.woff2", weight: "700" },
  ],
  variable: "--font-clash-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "PadiUp",
  description: "Meet people, padi up and climb the leaderboard.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Font variables live on <html> so theme tokens defined on :root can resolve them.
    <html lang="en" className={`${googleSans.variable} ${clashDisplay.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
