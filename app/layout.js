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

export const metadata = {
  title: "wowboost",
  description: "Boost service",
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
      <body
        className={`${numeric.variable} ${cinzelRoman.variable} ${cinzel.variable} ${cormorant.variable} min-h-screen bg-neutral-950 text-white antialiased`}
      >
        <Providers>
          <FallingLeaves />
          <Navbar />

          <main className="relative z-10">{children}</main>

          {/* Bottom-left contact bar (Discord) */}
          <ContactBar />

          {/* Identificar al usuario en tawk.to cuando haya sesión */}
          <TawkIdentify />

          {/* Tawk.to widget */}
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
