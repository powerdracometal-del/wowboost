"use client";
import Link from "next/link";

function ProductGrid({ title, items }) {
  return (
    <section className="mt-10">
      <h2 className="text-center text-3xl font-bold text-amber-300 drop-shadow mb-6">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="relative border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 shadow-xl overflow-hidden min-h-[260px] flex flex-col justify-between cursor-pointer group"
          >
            {/* Fondo con Tesoro.png */}
            <img
              src="/Tesoro.png"
              alt={`${p.title} background`}
              className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-45 transition duration-500"
            />

            {/* Capa oscura para contraste */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80 rounded-2xl" />

            {/* Contenido */}
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold text-amber-300 drop-shadow-md mb-2">
                  {p.title}
                </h3>
                <p className="text-white/85 mb-4 leading-relaxed">{p.desc}</p>
              </div>

              <div className="mt-auto">
                <span className="inline-block bg-indigo-600 group-hover:bg-indigo-500 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-indigo-700/40">
                  View Details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Products() {
  const coreServices = [
    {
      slug: "mythic-plus",
      title: "Mythic +6–17 Dungeons Boost",
      desc: "Fast and safe Mythic+ dungeon runs with traders.",
    },
    {
      slug: "bundles",
      title: "Bundles 3 + 1 Free",
      desc: "Get more value with our exclusive Mythic+ bundle offers.",
    },
    {
      slug: "delves",
      title: "Delves Tier 1–11",
      desc: "Choose multiple tiers and run counts. Safe delivery guaranteed.",
    },
    {
      slug: "gold",
      title: "Gold Sale",
      desc: "Buy WoW gold safely and quickly. Instant coordination via Discord.",
    },
  ];

  const keystonePackages = [
    {
      slug: "ksm",
      title: "KSM — Keystone Master (S3)",
      desc: "Secure the seasonal mount and achievement fast and safely.",
    },
    {
      slug: "ksh",
      title: "KSH — Keystone Hero (S3)",
      desc: "Push your Mythic Score and claim high-end rewards.",
    },
    {
      slug: "ksl",
      title: "KSL — Keystone Legend (S3)",
      desc: "Top-tier milestone with exclusive rewards and mounts.",
    },
  ];

  return (
    <main className="mx-auto px-6 py-10">
      <h1 className="text-center text-4xl font-bold text-amber-300 drop-shadow-lg mb-4">
        Our Services
      </h1>
      <p className="text-center text-white/80 max-w-3xl mx-auto">
        Choose the service that fits your goals. All purchases are coordinated via Discord after checkout.
      </p>

      <ProductGrid title="Core Services" items={coreServices} />
      <ProductGrid title="Keystone Packages — Season 3" items={keystonePackages} />
    </main>
  );
}
