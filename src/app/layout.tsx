import type { Metadata } from "next";
import { Poppins, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import 'react-toastify/dist/ReactToastify.css';

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-poppins" });
const spacemono = Space_Mono({ subsets: ["latin"], weight: ["700"], variable: "--font-spacemono" });

// Enhanced metadata for SEO: Includes title, description, keywords, open graph, twitter cards, and more
export const metadata: Metadata = {
  title: {
    default: "Bluffy - Online Bluff Card Game | Multiplayer Bluffing Fun | card games",
    template: "%s | Bluffy - Bluff Your Way to Victory",
  },
  description: "Bluffy is an exciting online multiplayer bluff card game. Bluff your friends, challenge plays, and be the first to empty your hand. Play free bluffing card games with strategy and deception!",
  keywords: [
    "bluff card game",
    "online bluff game",
    "multiplayer card game",
    "bluffing game",
    "free card games",
    "poker bluff",
    "card games",
    "deception card game",
    "strategy card game",
    "online multiplayer games",
    "bluff challenge",
    "card bluffing",
    "fun card games",
    "browser card game",
    "real-time multiplayer bluff",
  ],
  authors: [{ name: "Bluffy Team" }],
  creator: "Abdullah Shaikh",
  publisher: "Abdullah Shaikh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Bluffy - Bluff Your Way to Victory in This Multiplayer Card Game",
    description: "Join friends in Bluffy, the ultimate online bluff card game. Deceive, challenge, and win by emptying your hand first!",
    url: "https://bluffy.nitrr.in", // Replace with your actual domain
    siteName: "Bluffy",
    images: [
      {
        url: "/cards/kh.svg", // Add an OG image in your public folder (1200x630 recommended)
        width: 1200,
        height: 630,
        alt: "Bluffy Online Card Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bluffy - Online Multiplayer Bluff Card Game",
    description: "Bluff, challenge, and outsmart opponents in Bluffy – the free browser-based card game!",
    images: ["/cards/kd.svg"], // Add a Twitter-specific image (1200x675 recommended)
    creator: "@abdsbit", // Replace with your Twitter handle if applicable
  },
  icons: {
    icon: "/favicon.ico", // Add favicon in public folder
    shortcut: "/favicon2.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: "https://bluffy.nitrr.in", // Replace with your domain
  },
  
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data (JSON-LD) for SEO: Game Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Game",
              name: "Bluffy",
              description: "An online multiplayer bluff card game where players deceive and challenge to win.",
              genre: ["Card Game", "Strategy Game"],
              url: "https://bluffy.nitrr.in",
              image: "/cards/qh.svg",
              publisher: {
                "@type": "Organization",
                name: "Bluffy",
              },
              numberOfPlayers: {
                "@type": "QuantitativeValue",
                minValue: 2,
                maxValue: 6,
              },
            }),
          }}
        />
      </head>
      <body className={`${poppins.variable} ${spacemono.variable} font-sans bg-gradient-to-tr from-gray-950 to-blue-950 min-h-screen`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
