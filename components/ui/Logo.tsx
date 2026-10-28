// The Scaff "sparkle smile" mark, inlined so it can sit in the nav without a request.
export function LogoMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="10 51 198 198" className={className} aria-hidden>
      <defs>
        <linearGradient id="scaff-face" x1="30" y1="151" x2="188" y2="151" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FBFAF7" />
          <stop offset="0.38" stopColor="#D6EFFD" />
          <stop offset="1" stopColor="#0C8CE9" />
        </linearGradient>
      </defs>
      <path
        d="M109 71 C143.44 71 162.86 71 175.43 83.57 C188 96.14 188 115.56 188 150 C188 184.44 188 203.86 175.43 216.43 C162.86 229 143.44 229 109 229 C74.56 229 55.14 229 42.57 216.43 C30 203.86 30 184.44 30 150 C30 115.56 30 96.14 42.57 83.57 C55.14 71 74.56 71 109 71Z"
        fill="url(#scaff-face)"
        stroke="rgb(20 18 14 / 0.12)"
        strokeWidth="3"
      />
      <path
        d="M131.2 109.8 C131.4 108.8 132.6 108.8 132.8 109.8 C134.5 119.3 137.7 122.5 147.2 124.2 C148.2 124.4 148.2 125.6 147.2 125.8 C137.7 127.5 134.5 130.7 132.8 140.2 C132.6 141.2 131.4 141.2 131.2 140.2 C129.5 130.7 126.3 127.5 116.8 125.8 C115.8 125.6 115.8 124.4 116.8 124.2 C126.3 122.5 129.5 119.3 131.2 109.8Z"
        fill="#090A0D"
      />
      <path d="M87 184 C107 196 134 190 145 160" fill="none" stroke="#090A0D" strokeWidth="18" strokeLinecap="round" />
    </svg>
  );
}
