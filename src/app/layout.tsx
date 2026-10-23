import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PROFILE } from "@/lib/data";

const inter = localFont({ src: "../fonts/InterTight-Variable.woff2", variable: "--f-inter", weight: "100 900", display: "swap" });
const serif = localFont({
  src: [
    { path: "../fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--f-serif",
  display: "swap",
});
const mono = localFont({ src: "../fonts/JetBrainsMono-Variable.woff2", variable: "--f-mono", weight: "100 800", display: "swap" });

const desc = `${PROFILE.name} — ${PROFILE.role}. Production React, Next.js, Node.js and PostgreSQL applications for Central Railway and 4+ clients.`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${PROFILE.name} — ${PROFILE.role}`,
  description: desc,
  openGraph: { title: PROFILE.name, description: desc, type: "website", images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: PROFILE.name, description: desc, images: ["/og.jpg"] },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#f4f2ee", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
