"use client";
import Link from "next/link";

export default function Home() {
  return (
    <section className="login-container mx-auto max-w-6xl px-4 py-10 text-center space-y-10">
      {/* ===== Logo central grande ===== */}
      <div className="flex justify-center items-center py-10">
        <div className="relative w-[28rem] h-[28rem] logo-float">
          <img
            src="/zeppel_Logo.png"
            alt="WowBoost logo - WoW Carry & Mythic+ Boosts"
            className="w-full h-full object-contain"
          />
          <div className="logo-ring" />
        </div>
      </div>

      {/* ===== Recuadro principal con mensaje y botón ===== */}
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl hover:bg-white/10 transition-all duration-300 p-8">
        {/* === SEO-Optimized H1 === */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-300 drop-shadow-lg">
          WoW Carry & Mythic+ Boosts — Fast, Safe and Affordable
        </h1>

        {/* === Descripción con keywords === */}
        <p className="text-white/85 mb-6 text-lg leading-relaxed">
          Welcome to <strong>WowBoost</strong> — your trusted source for{" "}
          <strong>World of Warcraft boosting services</strong>. Our professional
          team offers <strong>Mythic+ carries</strong>,{" "}
          <strong>Keystone Master (KSM)</strong>,{" "}
          <strong>Keystone Hero (KSH)</strong>, and{" "}
          <strong>WoW gold farming</strong>. Enjoy{" "}
          <span className="text-amber-300 font-semibold">
            safe, fast, and affordable
          </span>{" "}
          boosting with real players and Discord support.
        </p>

        <Link
          href="/products"
          className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-700/40"
        >
          View All Offers →
        </Link>
      </div>
    </section>
  );
}
