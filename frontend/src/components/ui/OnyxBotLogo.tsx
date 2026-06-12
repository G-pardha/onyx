import React from 'react';

export default function OnyxBotLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sBodyG" cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="60%" stopColor="#e2e8f0"/>
          <stop offset="100%" stopColor="#cbd5e1"/>
        </radialGradient>
        <radialGradient id="sEyeG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8"/>
          <stop offset="100%" stopColor="#0284c7"/>
        </radialGradient>
        <filter id="sGlow">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Antenna */}
      <line x1="40" y1="6" x2="40" y2="14" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="40" cy="5" r="3.5" fill="#38BDF8" filter="url(#sGlow)"/>
      {/* Ears */}
      <ellipse cx="17" cy="28" rx="6" ry="8" fill="#cbd5e1"/>
      <ellipse cx="17" cy="28" rx="3.5" ry="5" fill="#38BDF8" filter="url(#sGlow)"/>
      <ellipse cx="63" cy="28" rx="6" ry="8" fill="#cbd5e1"/>
      <ellipse cx="63" cy="28" rx="3.5" ry="5" fill="#38BDF8" filter="url(#sGlow)"/>
      {/* Head */}
      <rect x="18" y="14" width="44" height="38" rx="16" fill="url(#sBodyG)"/>
      {/* Face Plate */}
      <rect x="22" y="24" width="36" height="20" rx="10" fill="#0B1220"/>
      {/* Eyes */}
      <ellipse cx="30" cy="34" rx="6" ry="6.5" fill="url(#sEyeG)" filter="url(#sGlow)"/>
      <circle cx="30" cy="34" r="2.5" fill="#bae6fd"/>
      <circle cx="28" cy="31.5" r="1.5" fill="white" opacity="0.9"/>
      
      <ellipse cx="50" cy="34" rx="6" ry="6.5" fill="url(#sEyeG)" filter="url(#sGlow)"/>
      <circle cx="50" cy="34" r="2.5" fill="#bae6fd"/>
      <circle cx="48" cy="31.5" r="1.5" fill="white" opacity="0.9"/>
      {/* Body top */}
      <rect x="24" y="54" width="32" height="20" rx="10" fill="url(#sBodyG)"/>
    </svg>
  );
}
