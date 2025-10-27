"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useParams } from "next/navigation";
import CheckboxList from "@/components/CheckboxList";
import PayPalButton from "@/components/PayPalButton";

/* -------------------- Add-ons para 3 traders -------------------- */
/** Mythic+ (add-on POR RUN) para 3 traders, índices 0..11 => +6..+17 */
const ADDON_TRADERS3_MYTHIC = [
  1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 999, 999, 999,
];

/** Bundles (add-on POR BUNDLE) para 3 traders, índices 0..11 => +6..+17 */
const ADDON_TRADERS3_BUNDLES = [
  4, 4.5, 5, 5.5, 6, 7, 8, 10, 14, 999, 999, 999,
];

/** Add-on fijo para 3 traders en KSM/KSH/KSL */
const ADDON_TRADERS3_KSM = 9;
const ADDON_TRADERS3_KSH = 12;
const ADDON_TRADERS3_KSL = 20;

/** Devuelve el add-on según el nivel y tabla; nunca bloquea. */
function addonForLevel(addonTable, level, traders) {
  if (traders !== 3) return 0;
  const idx = Number(level) - 6; // +6 => 0 ... +17 => 11
  return addonTable[idx] ?? 0;
}

/* -------------------- Shared data -------------------- */
const DUNGEONS = [
  { id: 1, name: "Arakara, City of Echoes", price: 0 },
  { id: 2, name: "The Dawnbreaker", price: 0 },
  { id: 3, name: "Priory of the Sacred Flame", price: 0 },
  { id: 4, name: "Operation: Floodgate", price: 0 },
  { id: 5, name: "Eco-dome Aldari", price: 0 },
  { id: 6, name: "Halls of Atonement", price: 0 },
  { id: 7, name: "Tazavesh: Streets of Wonder", price: 0 },
  { id: 8, name: "Tazavesh: Soleah's Gambit", price: 0 },
];

/* -------------------- Page -------------------- */
export default function ProductDetail() {
  const { slug } = useParams(); // Next 15
  const { data: session } = useSession();

  // ==== PRODUCT CONFIG ====
  const productMap = {
    "mythic-plus": {
      title: "Mythic +6–17 Dungeons Boost",
      description:
        "Professional Mythic+ carries from +6 to +17 with timer. Choose playstyle, traders, run type (random/specific), and the number of runs.",
      selectLabel: "Select Level",
      options: Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 6),
        label: `+${i + 6}`,
        // (Precios base que ya tenías)
        price: [5, 5.3, 5.7, 6, 6.5, 7, 8, 9, 12, 19, 28, 40][i],
      })),
      runs: { label: "Runs", min: 1, max: 15 },
      extras: {
        playLabel: "Playstyle",
        playValues: ["Selfplay", "Pilot"],
        tradersLabel: "Traders",
        tradersRange: { min: 1, max: 3 },
        runTypeLabel: "Run type",
        runTypeValues: ["Random", "Specific"],
      },
      // ⬇️ SUMA add-on por run si traders===3; NO bloquea niveles 999
      calc: ({ level, runs, traders }) => {
        const prices = [5, 5.3, 5.7, 6, 6.5, 7, 8, 9, 12, 19, 28, 40];
        const idx = Number(level) - 6;
        const base = prices[idx] || 0;
        const addon = addonForLevel(ADDON_TRADERS3_MYTHIC, level, traders);
        const unit = Number((base + addon).toFixed(2)); // por run
        const total = Number((unit * runs).toFixed(2));
        return { unit, total, addon };
      },
      validate: ({ level, runType, specificIds }) =>
        !!level &&
        (runType === "Random" || (runType === "Specific" && specificIds.length > 0)),
      note: ({ level, runs, play, traders, runType, specificIds }) =>
        `Mythic +${level} x${runs} | ${play} | Traders:${traders} | ${runType}` +
        (runType === "Specific" && specificIds.length
          ? ` (${specificIds
              .map((id) => DUNGEONS.find((d) => d.id === id)?.name)
              .filter(Boolean)
              .join(", ")})`
          : ""),
    },

    bundles: {
      title: "Bundles 3 + 1 Free",
      description:
        "Best value packs. Pick your level and how many bundles you want. Choose playstyle, traders, and run type (random/specific).",
      selectLabel: "Select Level",
      options: Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 6),
        label: `+${i + 6}`,
        // (Precios base que ya tenías)
        price: [17, 18, 19, 20, 22, 24, 28, 32, 40, 68, 98, 145][i],
      })),
      runs: { label: "Bundles", min: 1, max: 10 },
      extras: {
        playLabel: "Playstyle",
        playValues: ["Selfplay", "Pilot"],
        tradersLabel: "Traders",
        tradersRange: { min: 1, max: 3 },
        runTypeLabel: "Run type",
        runTypeValues: ["Random", "Specific"],
      },
      // ⬇️ SUMA add-on por bundle si traders===3; NO bloquea niveles 999
      calc: ({ level, runs, traders }) => {
        const prices = [17, 18, 19, 20, 22, 24, 28, 32, 40, 68, 98, 145];
        const idx = Number(level) - 6;
        const base = prices[idx] || 0;
        const addon = addonForLevel(ADDON_TRADERS3_BUNDLES, level, traders);
        const unit = Number((base + addon).toFixed(2)); // por bundle
        const total = Number((unit * runs).toFixed(2));
        return { unit, total, addon };
      },
      validate: ({ level }) => !!level,
      note: ({ level, runs, play, traders, runType }) =>
        `Bundles +${level} x${runs} | ${play} | Traders:${traders} | ${runType}`,
    },

    delves: {
      title: "Delves Tier 1–11",
      description:
        "Select one or more tiers and how many runs you want (1–15). Choose Selfplay or Pilot.",
      selectLabel: "Select Delve Tier(s)",
      options: [
        { id: 1, name: "Tier 1", price: 1 },
        { id: 2, name: "Tier 2", price: 1.5 },
        { id: 3, name: "Tier 3", price: 2 },
        { id: 4, name: "Tier 4", price: 2.5 },
        { id: 5, name: "Tier 5", price: 3 },
        { id: 6, name: "Tier 6", price: 3.5 },
        { id: 7, name: "Tier 7", price: 4 },
        { id: 8, name: "Tier 8", price: 4.5 },
        { id: 9, name: "Tier 9", price: 5 },
        { id: 10, name: "Tier 10", price: 6 },
        { id: 11, name: "Tier 11", price: 7 },
      ],
      runs: { label: "Runs", min: 1, max: 15 },
      extras: { playLabel: "Playstyle", playValues: ["Selfplay", "Pilot"] },
      calcMulti: ({ ids, runs }) => {
        const priceMap = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7];
        const unit = Number(ids.reduce((sum, id) => sum + priceMap[id - 1], 0).toFixed(2));
        const total = Number((unit * runs).toFixed(2));
        return { unit, total, addon: 0 };
      },
      validate: ({ ids }) => ids && ids.length > 0,
      note: ({ ids, runs, play }) =>
        `Delves ${ids.map((i) => `T${i}`).join(", ")} x${runs} | ${play}`,
    },

    gold: {
      title: "Gold Sale",
      description:
        "Select how much gold you want to buy. Safe delivery and coordination via Discord.",
      selectLabel: "Select amount",
      options: [
        { value: "100k", label: "100k Gold", price: 4.1 },
        { value: "200k", label: "200k Gold", price: 8.2 },
        { value: "300k", label: "300k Gold", price: 12.3 },
        { value: "400k", label: "400k Gold", price: 16.4 },
        { value: "500k", label: "500k Gold", price: 20.5 },
        { value: "600k", label: "600k Gold", price: 24.6 },
        { value: "700k", label: "700k Gold", price: 28.7 },
        { value: "800k", label: "800k Gold", price: 32.8 },
        { value: "900k", label: "900k Gold", price: 36.9 },
        { value: "1M", label: "1M Gold", price: 41.0 },
      ],
      runs: null,
      extras: null,
      calcGold: ({ amount }) => {
        const prices = new Map([
          ["100k", 4.1],
          ["200k", 8.2],
          ["300k", 12.3],
          ["400k", 16.4],
          ["500k", 20.5],
          ["600k", 24.6],
          ["700k", 28.7],
          ["800k", 32.8],
          ["900k", 36.9],
          ["1M", 41.0],
        ]);
        const unit = Number((prices.get(amount) || 0).toFixed(2));
        const total = unit;
        return { unit, total, addon: 0 };
      },
      validate: ({ amount }) => !!amount,
      note: ({ amount }) => `${amount} gold`,
    },

    // ======== KSM / KSH / KSL (paquetes fijos + add-on con traders=3) ========
    ksm: {
      title: "KSM — The War Within Keystone Master (Season 3)",
      description:
        "Get the seasonal Keystone Master achievement and mount quickly and safely.",
      fixedPrice: 36,
      runs: null,
      options: null,
      extras: {
        playLabel: "Playstyle",
        playValues: ["Selfplay", "Pilot"],
        tradersLabel: "Traders",
        tradersRange: { min: 1, max: 3 },
      },
      calcFixed: ({ fixedPrice, traders }) => {
        const addon = traders === 3 ? ADDON_TRADERS3_KSM : 0;
        const unit = Number((fixedPrice + addon).toFixed(2));
        return { unit, total: unit, addon };
      },
      validate: () => true,
      note: ({ play, traders }) => `KSM (Season 3) | ${play} | Traders:${traders}`,
    },

    ksh: {
      title: "KSH — The War Within Keystone Hero (Season 3)",
      description:
        "Push your Mythic+ rating to Keystone Hero with a professional team.",
      fixedPrice: 44,
      runs: null,
      options: null,
      extras: {
        playLabel: "Playstyle",
        playValues: ["Selfplay", "Pilot"],
        tradersLabel: "Traders",
        tradersRange: { min: 1, max: 3 },
      },
      calcFixed: ({ fixedPrice, traders }) => {
        const addon = traders === 3 ? ADDON_TRADERS3_KSH : 0;
        const unit = Number((fixedPrice + addon).toFixed(2));
        return { unit, total: unit, addon };
      },
      validate: () => true,
      note: ({ play, traders }) => `KSH (Season 3) | ${play} | Traders:${traders}`,
    },

    ksl: {
      title: "KSL — The War Within Keystone Legend (Season 3)",
      description:
        "Reach the Keystone Legend milestone and claim exclusive high-end rewards.",
      fixedPrice: 64,
      runs: null,
      options: null,
      extras: {
        playLabel: "Playstyle",
        playValues: ["Selfplay", "Pilot"],
        tradersLabel: "Traders",
        tradersRange: { min: 1, max: 3 },
      },
      calcFixed: ({ fixedPrice, traders }) => {
        const addon = traders === 3 ? ADDON_TRADERS3_KSL : 0;
        const unit = Number((fixedPrice + addon).toFixed(2));
        return { unit, total: unit, addon };
      },
      validate: () => true,
      note: ({ play, traders }) => `KSL (Season 3) | ${play} | Traders:${traders}`,
    },
  };

  const cfg = productMap[slug];

  // ---- State ----
  const [runs, setRuns] = useState(cfg?.runs ? cfg.runs.min : 1);
  const [singleValue, setSingleValue] = useState(""); // mythic/bundles/gold
  const [selectedIds, setSelectedIds] = useState([]); // delves tiers
  const [play, setPlay] = useState("Selfplay"); // Selfplay/Pilot
  const [traders, setTraders] = useState(1); // Mythic/Bundles/KSM/KSH/KSL
  const [runType, setRunType] = useState("Random"); // Mythic/Bundles only
  const [specificIds, setSpecificIds] = useState([]); // Mythic dungeons

  // ---- Calculations ----
  const { unit, total, addon } = useMemo(() => {
    if (!cfg) return { unit: 0, total: 0, addon: 0 };

    if (slug === "delves") return cfg.calcMulti({ ids: selectedIds, runs });
    if (slug === "gold") return cfg.calcGold({ amount: singleValue });

    if (slug === "ksm" || slug === "ksh" || slug === "ksl") {
      return cfg.calcFixed({ fixedPrice: cfg.fixedPrice, traders });
    }

    // mythic/bundles
    return cfg.calc({ level: singleValue, runs, traders });
  }, [cfg, slug, selectedIds, singleValue, runs, traders]);

  const isValid =
    cfg &&
    (slug === "delves"
      ? cfg.validate({ ids: selectedIds })
      : slug === "gold"
      ? cfg.validate({ amount: singleValue })
      : slug === "ksm" || slug === "ksh" || slug === "ksl"
      ? cfg.validate({})
      : cfg.validate({ level: singleValue, runType, specificIds }));

  // ---- Build note/description ----
  const note = useMemo(() => {
    if (!cfg) return "";
    if (slug === "delves") return cfg.note({ ids: selectedIds, runs, play });
    if (slug === "gold") return cfg.note({ amount: singleValue });
    if (slug === "ksm" || slug === "ksh" || slug === "ksl") {
      return cfg.note({ play, traders });
    }
    return cfg.note({ level: singleValue, runs, play, traders, runType, specificIds });
  }, [cfg, slug, selectedIds, singleValue, runs, play, traders, runType, specificIds]);

  // ---- PayPal params (amount + description) ----
  const pay = useMemo(() => {
    if (!cfg) return { amount: "0.00", description: "" };
    const description = note || cfg.title;
    if (slug === "ksm" || slug === "ksh" || slug === "ksl") {
      return { amount: Number(unit).toFixed(2), description };
    }
    return { amount: total.toFixed(2), description };
  }, [cfg, slug, note, unit, total]);

  if (!cfg) return <p className="p-10 text-center">Product not found.</p>;

  /* -------------------- RIGHT: Descriptions JSX by slug (tu bloque original) -------------------- */
  const rightPanels = {
    /* ... (TU MISMO CONTENIDO DE DESCRIPCIONES — NO CAMBIÉ NADA) ... */
    // Para no saturar el mensaje, he dejado tu mismo bloque original de rightPanels
    // exactamente igual que lo tenías en tu último mensaje. Pégalo tal cual.
    "mythic-plus": (
      <div>
        <h2 className="text-2xl font-bold text-amber-300 mb-4">Description</h2>
        <p className="text-white/85 mb-3">
          Our Mythic+ Boost is the fastest and safest way to conquer <i>The War Within</i> Mythic+ dungeons at your chosen difficulty level.
          Even the hardest affixes and the toughest +17 bosses are no problem for our pro team — no need to worry about pugs or in-time completion; we handle everything seamlessly.
        </p>
        <p className="text-white/85 mb-3">
          Whether you’re preparing for raid progression or aiming for Keystone Master rewards, our Mythic+ service ensures smooth, efficient, and reliable results.
        </p>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">What you get</h3>
        <ul className="list-disc list-inside space-y-1 text-white/85">
          <li><i>The War Within</i> Season 3 Mythic+ Dungeon runs with elite professional boosters</li>
          <li>FREE timer for +6–10 keys</li>
          <li>FREE up to 2 loot traders</li>
          <li>Guaranteed <b>694–707 ilvl gear</b> from the Great Vault (based on your highest key)</li>
          <li>Chance to get <b>684–701 ilvl gear</b> from the dungeon chest</li>
          <li>Dungeon teleports for +10 or higher completion</li>
          <li>Runed Ethereal Crest and Gilded Ethereal Crest</li>
          <li>Higher Mythic+ Score and Weekly Vault progress</li>
        </ul>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">Requirements</h3>
        <ul className="list-disc list-inside space-y-1 text-white/85">
          <li>Level 80 character</li>
          <li>Active account</li>
        </ul>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">More info</h3>
        <p className="text-white/85 mb-3">
          <b>Keys:</b> We usually provide our own keystones, but you can also request to use yours without extra cost.
          Choosing “Specific Dungeon” may slightly increase ETA due to key rotation.
        </p>
        <p className="text-white/85 mb-3">
          <b>Completion Methods:</b><br />
          <b>Piloted:</b> our team logs into your character using VPN protection to match your region.<br />
          <b>Selfplay:</b> you join the run and complete it with our boosters at the scheduled time.
        </p>
        <p className="text-white/85 mb-3">
          <b>Traders:</b> Extra traders are same-armor players who trade you any loot you can equip. More traders = higher loot chance.
        </p>
        <p className="text-white/85 mb-3">
          <b>Dungeon Options (for Specific runs):</b><br />
          Arakara, City of Echoes · The Dawnbreaker · Priory of the Sacred Flame · Operation: Floodgate · Eco-dome Aldari · Halls of Atonement · Tazavesh: Streets of Wonder · Tazavesh: Soleah’s Gambit
        </p>
      </div>
    ),
    bundles: (
      <div>
        <h2 className="text-2xl font-bold text-amber-300 mb-4">Description</h2>
        <p className="text-white/85 mb-3">
          Buy a Mythic+ bundle and get <b>one extra run FREE!</b> Each bundle includes four Mythic+ dungeon runs, optional loot traders, and guaranteed rewards.
        </p>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">What you get</h3>
        <ul className="list-disc list-inside space-y-1 text-white/85">
          <li>4 Mythic+ Dungeon runs (3 paid + 1 FREE)</li>
          <li>2 FREE loot traders per run</li>
          <li>FREE timer for +6–10 keys</li>
          <li>Select any key from +6 to +17</li>
          <li>Guaranteed <b>694–707 ilvl Great Vault gear</b> (based on highest key)</li>
          <li>Chance to get <b>684–701 ilvl items</b> from end-chests</li>
          <li>Plenty of Crests and Valorstones</li>
        </ul>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">Requirements</h3>
        <ul className="list-disc list-inside space-y-1 text-white/85">
          <li>Level 80 character</li>
          <li>Active account</li>
        </ul>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">More info</h3>
        <p className="text-white/85 mb-3">
          <b>Keys:</b> We usually use our own keystones. Selecting “Specific” keys may increase completion time slightly.
        </p>
        <p className="text-white/85 mb-3">
          <b>Completion Methods:</b><br />
          <b>Piloted:</b> our pro team logs in using VPN to match your country.<br />
          <b>Selfplay:</b> you play alongside us — just be online at the scheduled time.
        </p>
        <p className="text-white/85">
          <b>Traders:</b> Choose 1–3 loot traders for extra rewards. All tradeable items will be transferred to your character.
        </p>
      </div>
    ),
    delves: (
      <div>
        <h2 className="text-2xl font-bold text-amber-300 mb-4">Description</h2>
        <p className="text-white/85 mb-3">
          Start your <i>Delves</i> adventure and enjoy the rewards of the new <i>War Within</i> endgame content. Our professional team will complete the desired number of delves at your chosen tier — fast, safe, and efficient.
        </p>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">What you get</h3>
        <ul className="list-disc list-inside space-y-1 text-white/85">
          <li>Selected number of Delve runs at chosen tier</li>
          <li>Chance to get <b>655–684 ilvl</b> gear from the end of the run</li>
          <li>Chance to get <b>671–694 ilvl</b> gear from Delver’s Bounty (weekly)</li>
          <li>Guaranteed <b>655–694 ilvl</b> gear from the Great Vault (based on highest tier)</li>
          <li>Ethereal Crests (type depends on tier)</li>
          <li>Additional rewards: Valorstones, Resonance Crystals, Undercoin, cosmetics, and gold</li>
        </ul>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">Requirements</h3>
        <ul className="list-disc list-inside space-y-1 text-white/85">
          <li>Level 80 character</li>
          <li>Tier unlocked (or previous tier completed)</li>
          <li>Active account</li>
        </ul>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">More info</h3>
        <p className="text-white/85 mb-3">
          <b>Completion Methods:</b><br />
          <b>Piloted:</b> our pros play your account via VPN for full safety.<br />
          <b>Selfplay:</b> join us live and experience the run yourself.
        </p>
      </div>
    ),
    gold: (
      <div>
        <h2 className="text-2xl font-bold text-amber-300 mb-4">Description</h2>
        <p className="text-white/85 mb-3">
          Gold is traded safely through our <b>guild bank system</b>. You’ll need a character <b>without a guild</b>, which we will invite to our secure guild.
        </p>
        <p className="text-white/85 mb-3">
          Once inside, we’ll assign a temporary rank that allows you to <b>withdraw the exact amount of gold you purchased</b>. This method is safe, instant, and fully traceable through the in-game logs.
        </p>
      </div>
    ),
    ksm: (
      <div>
        <h2 className="text-2xl font-bold text-amber-300 mb-4">Description</h2>
        <p className="text-white/85 mb-3">
          Buy <b>The War Within Keystone Master</b> boost now and get the seasonal M+ mount and achievement. Our KSM service helps you secure rating, gear, and Vault progress quickly and safely.
        </p>
        <p className="text-white/85 mb-3">
          The Keystone Master achievement grants a new seasonal mount, title, and a solid boost to your Mythic+ score. You can split the journey into sessions to maximize Great Vault rewards along the way.
        </p>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">What you get</h3>
        <ul className="list-disc list-inside space-y-1 text-white/85">
          <li><b>Azure Void Flyer</b> mount and <b>The War Within Keystone Master: Season Three</b> achievement</li>
          <li>FREE x2 loot traders for every M+ run</li>
          <li>At least <b>2000 Mythic+ Rating</b> in Season 3</li>
          <li>Chance to get gear up to <b>694 ilvl</b> from end-chests and guaranteed <b>704 ilvl</b> from the Great Vault</li>
        </ul>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">Requirements</h3>
        <ul className="list-disc list-inside space-y-1 text-white/85">
          <li>Level 80 Character</li>
          <li>WoW: The War Within active subscription</li>
        </ul>
      </div>
    ),
    ksh: (
      <div>
        <h2 className="text-2xl font-bold text-amber-300 mb-4">Description</h2>
        <p className="text-white/85 mb-3">
          Buy <b>The War Within Keystone Hero</b> boost and push your Mythic+ rating efficiently with a professional team. Fast, coordinated, and safe — perfect to reach higher Vault and score milestones.
        </p>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">What you get</h3>
        <ul className="list-disc list-inside space-y-1 text-white/85">
          <li><b>The War Within Keystone Hero: Season Three</b> (and prior milestones on the way, including KSM)</li>
          <li>High-end gear progress via Great Vault and dungeon end-chests</li>
          <li>FREE x2 loot traders every M+ run</li>
          <li>Teleport to all Season 3 Mythic+ dungeons upon timer completions</li>
        </ul>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">Requirements</h3>
        <ul className="list-disc list-inside space-y-1 text-white/85">
          <li>Level 80 Character</li>
          <li>Recommended at least 645 ilvl</li>
        </ul>
      </div>
    ),
    ksl: (
      <div>
        <h2 className="text-2xl font-bold text-amber-300 mb-4">Description</h2>
        <p className="text-white/85 mb-3">
          Buy <b>The War Within Keystone Legend</b> boost and secure this top-tier milestone with exclusive rewards. The fastest and most reliable route with our PRO team.
        </p>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">What you get</h3>
        <ul className="list-disc list-inside space-y-1 text-white/85">
          <li><b>The War Within Keystone Legend: Season Three</b> (includes Hero and Master milestones along the path)</li>
          <li><b>Scarlet Void Flyer</b> and <b>Azure Void Flyer</b> mounts</li>
          <li><b>707 ilvl</b> Great Vault gear & <b>701 ilvl</b> dungeon loot</li>
          <li>FREE x2 loot traders every M+ run</li>
          <li>Teleport access to all Season 3 dungeons after in-time completions</li>
          <li><b>3000+ Mythic Score</b> target</li>
        </ul>
        <h3 className="text-xl font-semibold text-amber-200 mt-6 mb-2">Requirements</h3>
        <ul className="list-disc list-inside space-y-1 text-white/85">
          <li>Level 80 Character</li>
          <li>Recommended at least 645 ilvl</li>
        </ul>
      </div>
    ),
  };

  /* -------------------- UI -------------------- */
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/products" className="text-indigo-400 hover:underline">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* LEFT: purchase card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg space-y-6 hover:bg-white/10 transition-all duration-300">
          <h1 className="text-3xl font-bold text-amber-300 drop-shadow-md">
            {cfg.title}
          </h1>
          <p className="text-white/80">{cfg.description}</p>

          {/* Main selector (solo si hay opciones) */}
          {cfg.options && (
            <div>
              <label className="block text-lg mb-2 text-amber-200">
                {cfg.selectLabel}:
              </label>

              {slug === "delves" ? (
                <CheckboxList options={cfg.options} onChange={setSelectedIds} />
              ) : (
                <select
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2"
                  value={singleValue}
                  onChange={(e) => setSingleValue(e.target.value)}
                >
                  <option value="">Select an option</option>
                  {cfg.options.map((opt) => (
                    <option key={opt.value || opt.id} value={opt.value || opt.id}>
                      {opt.label ?? opt.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Runs (si aplica) */}
          {cfg.runs && (
            <div>
              <label className="block text-lg mb-2 text-amber-200">
                {cfg.runs.label}:
              </label>
              <select
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2"
                value={runs}
                onChange={(e) => setRuns(Number(e.target.value))}
              >
                {Array.from(
                  { length: cfg.runs.max - cfg.runs.min + 1 },
                  (_, i) => i + cfg.runs.min
                ).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Extras */}
          {cfg.extras?.playValues && (
            <div>
              <label className="block text-lg mb-2 text-amber-200">
                {cfg.extras.playLabel}:
              </label>
              <div className="flex gap-4">
                {cfg.extras.playValues.map((v) => (
                  <label
                    key={v}
                    className={`px-3 py-2 rounded-lg border cursor-pointer ${
                      play === v ? "border-amber-300 bg-white/10" : "border-white/20 bg-black/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="playstyle"
                      className="mr-2"
                      checked={play === v}
                      onChange={() => setPlay(v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div>
          )}

          {cfg.extras?.tradersRange && (
            <div>
              <label className="block text-lg mb-2 text-amber-200">
                {cfg.extras.tradersLabel}:
              </label>
              <select
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2"
                value={traders}
                onChange={(e) => setTraders(Number(e.target.value))}
              >
                {Array.from(
                  { length: cfg.extras.tradersRange.max - cfg.extras.tradersRange.min + 1 },
                  (_, i) => i + cfg.extras.tradersRange.min
                ).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(slug === "mythic-plus" || slug === "bundles") && (
            <>
              <div>
                <label className="block text-lg mb-2 text-amber-200">Run type:</label>
                <div className="flex gap-4">
                  {["Random", "Specific"].map((v) => (
                    <label
                      key={v}
                      className={`px-3 py-2 rounded-lg border cursor-pointer ${
                        runType === v ? "border-amber-300 bg-white/10" : "border-white/20 bg-black/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="runtype"
                        className="mr-2"
                        checked={runType === v}
                        onChange={() => setRunType(v)}
                      />
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              {slug === "mythic-plus" && runType === "Specific" && (
                <div>
                  <label className="block text-lg mb-2 text-amber-200">Select dungeon(s):</label>
                  <CheckboxList options={DUNGEONS} onChange={setSpecificIds} />
                  <p className="text-xs text-white/60 mt-2">
                    Pick at least one dungeon when choosing <b>Specific</b>.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Totals */}
          <div className="desc text-lg space-y-1 mt-2">
            {traders === 3 && typeof addon === "number" && !!singleValue && (
              <div className="text-sm text-white/70">
                Add-on (3 traders):{" "}
                <span className="price">${addon.toFixed(2)}</span>{" "}
                {slug === "bundles" ? "per bundle" : slug === "mythic-plus" ? "per run" : ""}
              </div>
            )}

            {slug === "ksm" || slug === "ksh" || slug === "ksl" ? (
              <div>
                Price: <span className="price font-bold">${unit.toFixed(2)}</span> USD
              </div>
            ) : slug === "gold" ? (
              <div>
                Price: <span className="price font-bold">${total.toFixed(2)}</span> USD
              </div>
            ) : (
              <>
                <div>
                  Unit total: <span className="price font-bold">${unit.toFixed(2)}</span> USD
                </div>
                <div>
                  Grand Total ({cfg.runs?.label ?? "Runs"} x{runs}):{" "}
                  <span className="price font-bold">${total.toFixed(2)}</span> USD
                </div>
              </>
            )}
          </div>

          {/* Pay / Login */}
          {session && isValid ? (
            <div className="mt-2">
              <PayPalButton
                amount={pay.amount}
                description={pay.description}
                containerId={`pp-${slug}`}
              />
            </div>
          ) : (
            <>
              {!session && (
                <p className="desc text-red-300 text-sm">
                  You must sign in with Discord before making a purchase.
                </p>
              )}
              <button
                onClick={() => (!session ? signIn("discord") : null)}
                disabled={!!session && !isValid}
                className={`w-full rounded-xl py-3 text-sm font-semibold ${
                  !session || !isValid
                    ? "opacity-60 cursor-not-allowed bg-indigo-600/60"
                    : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                {!session ? "Sign in with Discord" : "Select options to buy"}
              </button>
            </>
          )}
        </div>

        {/* RIGHT: description panel */}
        <aside className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-lg hover:bg-white/10 transition-all duration-300">
          {rightPanels[slug]}
        </aside>
      </div>
    </section>
  );
}
