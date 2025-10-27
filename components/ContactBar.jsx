"use client";

export default function ContactBar() {
  const DISCORD_URL = "https://discord.com/users/ejecutorforever";

  return (
    <div className="contact-bar">
      <span className="contact-label">Contact:</span>

      {/* Discord */}
      <a
        href={DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="icon-btn discord"
        aria-label="Contact via Discord"
        title="Contact via Discord"
      >
        {/* Discord SVG */}
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.317 4.369A19.791 19.791 0 0016.558 3c-.2.36-.433.84-.59 1.227a18.27 18.27 0 00-7.935 0A7.04 7.04 0 007.442 3a19.736 19.736 0 00-3.76 1.369C1.64 8.046.94 11.6 1.174 15.115c1.58 1.18 3.112 1.9 4.606 2.375.372-.51.704-1.05.987-1.616-.54-.206-1.057-.456-1.55-.744.13-.096.257-.196.38-.3 2.98 1.386 6.2 1.386 9.18 0 .124.104.25.204.38.3-.493.288-1.01.538-1.55.744.283.566.615 1.106.987 1.616 1.494-.475 3.026-1.195 4.606-2.375.377-5.255-.64-8.776-3.965-10.746zM9.25 13.5c-.84 0-1.52-.78-1.52-1.74 0-.96.68-1.74 1.52-1.74s1.53.78 1.53 1.74-.69 1.74-1.53 1.74zm5.5 0c-.84 0-1.52-.78-1.52-1.74 0-.96.68-1.74 1.52-1.74s1.53.78 1.53 1.74-.69 1.74-1.53 1.74z"
          />
        </svg>
      </a>
    </div>
  );
}
