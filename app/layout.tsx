import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Ahmed Aziz Barhoumi — AI & Data Science Engineer", template: "%s — Ahmed Aziz Barhoumi" },
  description: "Ahmed Aziz Barhoumi is an AI & Data Science engineering student in Tunis, focused on generative AI, agentic systems, and machine learning.",
  alternates: { canonical: "/" },
  openGraph: { title: "Ahmed Aziz Barhoumi — AI & Data Science Engineer", description: "Building AI systems that actually ship.", type: "website", url: "/", images: ["/og.svg"] },
  twitter: { card: "summary_large_image", title: "Ahmed Aziz Barhoumi — AI & Data Science Engineer", description: "Building AI systems that actually ship.", images: ["/og.svg"] },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="dark" suppressHydrationWarning><body className={`${display.variable} ${mono.variable}`}><SiteShell>{children}</SiteShell></body></html>;
}
