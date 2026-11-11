/**
 * Midad mark: an open book whose pages rise into an arch, crowned by an
 * eight-pointed star — a library, a doorway and a guiding light.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-hidden>
      <rect width="48" height="48" rx="13" fill="#123a31" />
      <rect x="1" y="1" width="46" height="46" rx="12" fill="none" stroke="#e2b65f" strokeOpacity=".35" />
      {/* arch */}
      <path d="M14.5 33V22.5a9.5 9.5 0 0 1 19 0V33" fill="none" stroke="#e2b65f" strokeWidth="2.2" strokeLinecap="round" />
      {/* eight-pointed star */}
      <g fill="#f5d48b" transform="translate(24 21.5)">
        <rect x="-3.6" y="-3.6" width="7.2" height="7.2" />
        <rect x="-3.6" y="-3.6" width="7.2" height="7.2" transform="rotate(45)" />
      </g>
      <circle cx="24" cy="21.5" r="1.6" fill="#123a31" />
      {/* open book */}
      <path d="M8.5 32.6c5.2-2.1 10.4-1.7 15.5 1.3 5.1-3 10.3-3.4 15.5-1.3v3.6c-5.2-2.1-10.4-1.7-15.5 1.3-5.1-3-10.3-3.4-15.5-1.3z" fill="#e2b65f" />
      <path d="M24 33.9v3.6" stroke="#123a31" strokeWidth="1.2" />
    </svg>
  );
}
