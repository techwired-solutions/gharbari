/**
 * Bespoke line-art skyline for the hero, in place of a generic stock photo.
 * Purely decorative — hidden from assistive tech.
 */
export function HeroArt() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1b3e35" />
          <stop offset="100%" stopColor="#0f2620" />
        </linearGradient>
      </defs>
      <rect width="1200" height="600" fill="url(#heroBg)" />

      {/* faint topographic contour lines */}
      <g stroke="#e3f0e6" strokeOpacity="0.08" fill="none" strokeWidth="1.5">
        <path d="M-40 120 C 220 60, 480 180, 760 90 S 1180 140, 1260 80" />
        <path d="M-40 210 C 260 150, 520 260, 800 170 S 1180 220, 1260 170" />
        <path d="M-40 300 C 300 250, 560 340, 840 260 S 1200 300, 1260 260" />
      </g>

      {/* rooftop skyline */}
      <g fill="#132a24">
        <rect x="0" y="470" width="1200" height="130" />
      </g>
      <g stroke="#c9dcd2" strokeOpacity="0.55" strokeWidth="2.5" fill="none" strokeLinejoin="round">
        <path d="M-20 470 L60 470 L60 400 L100 370 L140 400 L140 470 L230 470" />
        <path d="M230 470 L230 380 L300 330 L370 380 L370 470" />
        <path d="M370 470 L420 470 L420 420 L460 420 L460 470" />
        <path d="M460 470 L460 350 L540 300 L620 350 L620 470" />
        <path d="M620 470 L680 470 L680 410 L740 410 L740 470" />
        <path d="M740 470 L820 470 L820 360 L900 310 L980 360 L980 470" />
        <path d="M980 470 L1040 470 L1040 430 L1090 430 L1090 470" />
        <path d="M1090 470 L1160 470 L1160 390 L1220 390 L1220 470" />
      </g>
      <g fill="#e6a97e" fillOpacity="0.9">
        <circle cx="100" cy="370" r="3" />
        <circle cx="300" cy="330" r="3" />
        <circle cx="540" cy="300" r="3" />
        <circle cx="900" cy="310" r="3" />
      </g>
    </svg>
  );
}
