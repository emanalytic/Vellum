import React from 'react';

const Logo: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 48 }) => {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-ink"
      >
        <path
          d="M20 15 C 20 15, 65 13, 75 16 L 72 26 L 85 85 C 83 87, 76 91, 15 95 C 12 85, 9 75, 15 20 C 15 20, 18 16, 20 15"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="white"
          className="drop-shadow-sm"
        />
        
        <path
          d="M75 16 L 85 28 L 72 26 Z"
          fill="currentColor"
          opacity="0.15"
        />
        
        <path
          d="M75 16 L 72 26"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        <path
          d="M75 16 L 85 28 L 72 26"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <path
          d="M28 50 L 42 64 L 65 38"
          stroke="var(--color-highlighter-pink)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-80"
          style={{ filter: "blur(0.5px)" }}
        />
        
        <path
          d="M25 75 Q 50 72 75 78"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.2"
        />
      </svg>
    </div>
  );
};

export default Logo;