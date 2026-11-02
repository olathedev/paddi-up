import type { Metadata } from "next";
import Backdrop from "@/components/Backdrop";
import ThemeSync from "@/components/ThemeSync";
import { themeScript } from "@/lib/theme";

export const metadata: Metadata = {
  title: { default: "PadiUp", template: "%s · PadiUp" },
  description: "PadiUp: four stages, one leaderboard. Follow, padi up, blitz the quiz and link up with partners.",
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-quest-theme is set by the inline script before first paint (no flash).
    <div className="quest-night min-h-dvh" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <ThemeSync />
      <Backdrop />
      {children}
    </div>
  );
}
