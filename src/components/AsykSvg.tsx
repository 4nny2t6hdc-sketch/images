import React from 'react';
import { AsykPosition } from '../types/game';

interface AsykSvgProps {
  type: AsykPosition | 'saka';
  size?: number;
  className?: string;
  glow?: boolean;
}

export const AsykSvg: React.FC<AsykSvgProps> = ({
  type,
  size = 64,
  className = '',
  glow = false,
}) => {
  if (type === 'saka') {
    // The master lead-weighted Saka with brass bands and turquoise inlay
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} ${glow ? 'filter drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' : 'drop-shadow-md'}`}
      >
        <defs>
          <radialGradient id="sakaBody" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="35%" stopColor="#E2D4B7" />
            <stop offset="70%" stopColor="#C4AA7A" />
            <stop offset="100%" stopColor="#8A6B3D" />
          </radialGradient>
          <linearGradient id="brassBand" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <radialGradient id="turquoiseGem" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="55%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0E7490" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="50" cy="85" rx="32" ry="10" fill="rgba(0,0,0,0.35)" />

        {/* Anatomical bone contours of Asyk */}
        <path
          d="M32 20 C22 28 18 42 22 62 C25 74 38 82 52 82 C68 82 78 72 80 58 C82 38 72 24 58 18 C46 14 38 15 32 20 Z"
          fill="url(#sakaBody)"
          stroke="#684D23"
          strokeWidth="2.5"
        />

        {/* Hollow ridges and bone anatomy */}
        <path
          d="M34 32 C38 42 42 54 40 68 C45 70 54 70 58 64 C62 50 56 36 50 28"
          stroke="#7A5C2B"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />

        {/* Lead filling core indicator (Қорғасын құйылған) */}
        <ellipse cx="49" cy="48" rx="14" ry="18" fill="#52525B" stroke="#3F3F46" strokeWidth="1.5" opacity="0.85" />
        <ellipse cx="49" cy="48" rx="11" ry="15" fill="#71717A" opacity="0.6" />

        {/* Traditional Brass / Gold Binding Belt */}
        <path
          d="M26 48 Q50 54 76 46"
          stroke="url(#brassBand)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M26 48 Q50 54 76 46"
          stroke="#FDE68A"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inlaid Sacred Turquoise Stone (Көктас) */}
        <circle cx="50" cy="48" r="6" fill="url(#turquoiseGem)" stroke="#164E63" strokeWidth="1.5" />
        <circle cx="48" cy="46" r="1.5" fill="#FFFFFF" opacity="0.8" />
      </svg>
    );
  }

  // Regular sheep knucklebone in 4 positions
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? 'filter drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]' : 'drop-shadow-sm'}`}
    >
      <defs>
        <radialGradient id="boneLight" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#F5EEDB" />
          <stop offset="75%" stopColor="#DECDB0" />
          <stop offset="100%" stopColor="#B39E7E" />
        </radialGradient>
        <radialGradient id="boneShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C4B191" />
          <stop offset="100%" stopColor="#8C7350" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="84" rx="28" ry="8" fill="rgba(0,0,0,0.3)" />

      {type === 'alshy' && (
        // Алшы: Standing on ridge, hollow notch pointing up (Winner position)
        <g>
          <path
            d="M32 18 C24 26 22 45 26 65 C29 76 42 82 55 81 C68 80 77 70 78 54 C79 36 71 22 56 16 C46 12 37 13 32 18 Z"
            fill="url(#boneLight)"
            stroke="#8C7350"
            strokeWidth="2"
          />
          {/* Upper notch hollow */}
          <path
            d="M40 22 C45 28 55 28 60 22 C62 26 58 32 50 33 C42 32 38 26 40 22 Z"
            fill="url(#boneShadow)"
            stroke="#6B5336"
            strokeWidth="1.2"
          />
          {/* Ridge groove */}
          <path
            d="M36 38 C42 46 45 58 44 72"
            stroke="#9A825E"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M58 38 C62 48 64 60 62 70"
            stroke="#9A825E"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Golden lucky crest accent */}
          <circle cx="50" cy="52" r="3.5" fill="#D97706" opacity="0.9" />
          <circle cx="50" cy="52" r="1.5" fill="#FEF3C7" />
        </g>
      )}

      {type === 'tayke' && (
        // Тәйке: Standing reverse side
        <g>
          <path
            d="M34 16 C22 24 20 42 24 64 C28 78 44 82 58 80 C70 78 78 66 76 50 C74 34 68 20 52 16 C44 14 38 14 34 16 Z"
            fill="url(#boneLight)"
            stroke="#8C7350"
            strokeWidth="2"
          />
          {/* Reverse ridge */}
          <ellipse cx="50" cy="46" rx="14" ry="20" fill="url(#boneShadow)" opacity="0.75" />
          <path
            d="M42 32 C48 38 52 50 50 64"
            stroke="#6B5336"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Silver/emerald dot */}
          <circle cx="50" cy="46" r="3.5" fill="#059669" opacity="0.85" />
          <circle cx="50" cy="46" r="1.5" fill="#A7F3D0" />
        </g>
      )}

      {type === 'buk' && (
        // Бүк: Convex back facing up
        <g>
          <path
            d="M24 35 C20 48 24 68 38 76 C52 84 72 80 80 66 C86 52 80 36 68 28 C54 20 32 24 24 35 Z"
            fill="url(#boneLight)"
            stroke="#8C7350"
            strokeWidth="2"
          />
          {/* Convex hump texture */}
          <ellipse cx="52" cy="48" rx="20" ry="14" fill="url(#boneShadow)" opacity="0.6" />
          <path
            d="M34 44 Q50 36 68 46"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Crimson wool accent mark */}
          <circle cx="52" cy="50" r="3.5" fill="#E11D48" opacity="0.9" />
          <circle cx="52" cy="50" r="1.5" fill="#FFE4E6" />
        </g>
      )}

      {type === 'shik' && (
        // Шік: Concave hollow facing up
        <g>
          <path
            d="M22 36 C18 50 24 70 38 78 C54 84 74 78 80 64 C86 48 78 34 66 26 C50 18 30 24 22 36 Z"
            fill="url(#boneLight)"
            stroke="#8C7350"
            strokeWidth="2"
          />
          {/* Deep inner cavity */}
          <ellipse cx="50" cy="52" rx="18" ry="12" fill="#786142" stroke="#57432A" strokeWidth="1.5" />
          <ellipse cx="50" cy="53" rx="12" ry="7" fill="#4A3720" />
          {/* Turquoise dot */}
          <circle cx="50" cy="52" r="3" fill="#0284C7" opacity="0.9" />
          <circle cx="50" cy="52" r="1" fill="#BAE6FD" />
        </g>
      )}
    </svg>
  );
};
