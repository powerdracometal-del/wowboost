"use client";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 bg-black/30 backdrop-blur border-b border-white/10">
      {/* === Logo y texto WOWBOOST === */}
      <div className="flex items-center gap-3">
        <a href="/" className="relative group flex items-center gap-3">
          <div className="logo-orbit relative">
            <div className="logo-ring" />
            <Image
              src="/zeppel_Logo.png"
              alt="WOWBOOST Logo"
              width={56}
              height={56}
              priority
              className="drop-shadow-lg"
            />
          </div>
          <span className="brand-title select-none">WOWBOOST</span>
        </a>
      </div>

      {/* === Botón de sesión Discord === */}
      <div>
        {!session ? (
          <button
            onClick={() => signIn("discord")}
            className="discord-login bg-indigo-600 px-4 py-2 rounded-xl text-sm hover:bg-indigo-500 transition"
          >
            Sign in with Discord
          </button>
        ) : (
          <button
            onClick={() => signOut()}
            className="bg-red-600 px-4 py-2 rounded-xl text-sm hover:bg-red-500 transition"
          >
            Sign out
          </button>
        )}
      </div>
    </nav>
  );
}
