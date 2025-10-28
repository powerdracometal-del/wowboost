// app/layout.js
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import FallingLeaves from "@/components/FallingLeaves";
import ContactBar from "@/components/ContactBar";
import TawkIdentify from "@/components/TawkIdentify";
import Script from "next/script";

// Fonts
import {
  Cinzel_Decorative,
  Cormorant_Garamond,
  Cinzel,
  Inter,
} from "next/font/google";

// ========== SEO METADATA ==========
export const metadata = {
  metadataBase: new URL("https://www.wowboost.lat"),
  title: {
    default: "WowBoost — WoW Carry & Mythic+ Boosts",
    template: "%s | WowBoost",
  },
  description:
    "Get safe, fast, and affordable World of Warcraft boosting services — Mythic+, Keystone Master (KSM), and gold carries. Trusted WoW carry team!",
  keywords: [
    "wow carry",
    "wow boost",
    "wow boosting",
    "mythic+ boost",
    "mythic plus carry",
    "wow carry service",
    "keystone master",
    "ksm",
    "ksh",
    "ksh boost",
    "wow gold",
  ],
  alternates: {
    canonical: "/", // https://www.wowboost.lat/
    languages: {
      "en-US": "/",
      "es-CO": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.wowboost.lat",
    siteName: "WowBoost",
    title: "WowBoost — WoW Carry & Mythic+ Boosts",
    description:
      "Professional World of Warcraft boosting services: Mythic+, Keystone Master, KSM, and gold carries. Safe and fast WoW boosts!",
    images: [
      {
        url: "/wowboost.png", // este archivo debe estar en /public
        width: 1200,
        height: 630,
        alt: "WowBoost — WoW Carry & Mythic+ Boosts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WowBoost — WoW Carry & Mythic+ Boosts",
    description:
      "Buy safe and fast World of Warcraft carries: Mythic+ boosts, Keystone Master (KSM/KSH), and gold services.",
    images: ["/wowboost.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
};

// === Font setup ===
const cinzelRoman = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel-roman",
});

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const numeric = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-numeric",
});

export default function RootLayout({ children }) {
  const TAWK_PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
  const TAWK_WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "default";

  return (
    <html lang="en">
      <head>
        {/* === Google Analytics === */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WGNB6J681F"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WGNB6J681F');
            `,
          }}
        />

        {/* === JSON-LD: Organization === */}
        <Script
          id="org-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "WowBoost",
              url: "https://www.wowboost.lat",
              logo: "https://www.wowboost.lat/favicon.ico",
              sameAs: [
                // agrega redes si las tienes
                // "https://discord.gg/tu-servidor"
              ],
            }),
          }}
        />
      </head>

      <body
        className={`${numeric.variable} ${cinzelRoman.variable} ${cinzel.variable} ${cormorant.variable} min-h-screen bg-neutral-950 text-white antialiased`}
      >
        <Providers>
          <FallingLeaves />
          <Navbar />

          <main className="relative z-10">{children}</main>

          <ContactBar />
          <TawkIdentify />

          {TAWK_PROPERTY_ID && (
            <Script
              id="tawk-script"
              strategy="afterInteractive"
              src={`https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`}
            />
          )}
        </Providers>
      </body>
    </html>
  );
}
