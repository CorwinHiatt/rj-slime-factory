export default function Logo({ className = 'h-10 w-auto' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 60"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06D6A0" />
        </linearGradient>
        <linearGradient id="drip1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="100%" stopColor="#E855A0" />
        </linearGradient>
      </defs>
      {/* Slime blob icon */}
      <g transform="translate(0, 5)">
        {/* Main blob */}
        <path
          d="M8 15 C8 8, 15 2, 25 2 C35 2, 42 8, 42 15 C42 22, 38 28, 35 32 C32 36, 28 42, 25 45 C22 42, 18 36, 15 32 C12 28, 8 22, 8 15Z"
          fill="url(#logoGradient)"
        />
        {/* Drip 1 */}
        <path
          d="M14 28 C14 28, 12 35, 12 38 C12 40, 13 41, 14 41 C15 41, 16 40, 16 38 C16 35, 14 28, 14 28Z"
          fill="url(#drip1)"
          opacity="0.8"
        />
        {/* Drip 2 */}
        <path
          d="M34 26 C34 26, 36 34, 36 37 C36 39, 35 40, 34 40 C33 40, 32 39, 32 37 C32 34, 34 26, 34 26Z"
          fill="url(#drip1)"
          opacity="0.7"
        />
        {/* Shine */}
        <ellipse cx="20" cy="12" rx="4" ry="3" fill="white" opacity="0.4" />
      </g>
      {/* Text */}
      <text
        x="52"
        y="28"
        fontFamily="Fredoka, sans-serif"
        fontWeight="700"
        fontSize="22"
        fill="url(#logoGradient)"
        letterSpacing="-0.5"
      >
        RJ Slime
      </text>
      <text
        x="52"
        y="50"
        fontFamily="Fredoka, sans-serif"
        fontWeight="500"
        fontSize="16"
        fill="#8B5CF6"
        letterSpacing="3"
      >
        FACTORY
      </text>
    </svg>
  );
}
