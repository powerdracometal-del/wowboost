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
    "Safe, fast World of Warcraft carries: Mythic+ boosts (+6–17), Keystone Master/Hero, bundles and gold. PayPal checkout and Discord support.",
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
    "world of warcraft boosting",
    "wow gold service",
  ],
  alternates: {
    canonical: "/",
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

  // === ICONOS / FAVICON ===
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
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
  const TAWK_WIDGET_ID =
    process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "default";

  return (
    <html lang="en">
      {/* 💎 Head limpio y final */}
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
              logo: "https://www.wowboost.lat/apple-touch-icon.png",
              sameAs: [],
            }),
          }}
        />

        {/* === JSON-LD: WebSite (Sitelinks Search Box) === */}
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "WowBoost",
              url: "https://www.wowboost.lat",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://www.wowboost.lat/products?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        <meta name="theme-color" content="#000000" />
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
