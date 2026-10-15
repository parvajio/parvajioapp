import type { Metadata } from "next";
import {
  Geist,
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://parvajio.dev"),
  title: "Parvaj — Developer / Problem Solver",
  description:
    "MD. Parvaj Mosharof — CSE student and full-stack developer building fast, clean, secure web apps.",
  openGraph: {
    title: "Parvaj — Developer / Problem Solver",
    description:
      "MD. Parvaj Mosharof — CSE student and full-stack developer building fast, clean, secure web apps.",
    url: "https://parvajio.dev",
    siteName: "parvajio.dev",
    images: [{ url: "/profile2.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parvaj — Developer / Problem Solver",
    description:
      "MD. Parvaj Mosharof — CSE student and full-stack developer building fast, clean, secure web apps.",
    images: ["/profile2.png"],
  },
  icons: {
    icon: "/profile2.png",
    apple: "/profile2.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-accent="grape"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${geistSans.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
