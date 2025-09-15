import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "RECOMMEND • AI-Powered Song, Movie & TV Show Recommendations",
  description: "Find your next track, film & series with AI recommendations powered by Gemini 2.5 Flash. No login required, privacy-friendly.",
  keywords: "music recommendations, movie recommendations, tv show recommendations, AI, songs, films, series, Gemini",
  authors: [{ name: "RECOMMEND" }],
  openGraph: {
    title: "RECOMMEND • AI-Powered Song, Movie & TV Show Recommendations",
    description: "Find your next track, film & series with AI recommendations powered by Gemini 2.5 Flash",
    type: "website",
    siteName: "RECOMMEND"
  },
  twitter: {
    card: "summary_large_image",
    title: "RECOMMEND • AI-Powered Song, Movie & TV Show Recommendations",
    description: "Find your next track, film & series with AI recommendations powered by Gemini 2.5 Flash"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          <AppShell>
            {children}
          </AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
