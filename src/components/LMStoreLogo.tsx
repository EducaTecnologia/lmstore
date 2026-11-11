import React from 'react';

interface LMStoreLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  theme?: 'dark' | 'light';
  inverted?: boolean;
}

export const LMStoreLogo: React.FC<LMStoreLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  theme = 'dark',
  inverted = false
}) => {
  const isLight = theme === 'light' || inverted;

  // Sizing definitions
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 42 : 34;

  const textColor = isLight ? 'text-white' : 'text-slate-900';
  const subtitleColor = isLight ? 'text-amber-400' : 'text-amber-600';

  if (variant === 'icon') {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="64" height="64" rx="14" fill="#0f172a" />
        <path d="M12 48L12 18L32 10L32 48" stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 10L52 20L52 48" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 28L32 20L52 30" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 38L32 30L52 40" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="8" y="48" width="48" height="6" rx="2" fill="#ea580c" />
        <text x="32" y="44" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="16" fill="#ffffff" textAnchor="middle">
          LM
        </text>
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Structural Logo Emblem */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 shadow-xs"
      >
        <rect width="64" height="64" rx="14" fill="#0f172a" />
        <path d="M12 48L12 18L32 10L32 48" stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 10L52 20L52 48" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 28L32 20L52 30" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 38L32 30L52 40" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="8" y="48" width="48" height="6" rx="2" fill="#ea580c" />
        <text x="32" y="44" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="16" fill="#ffffff" textAnchor="middle">
          LM
        </text>
      </svg>

      {/* Typography Lockup */}
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-center gap-1">
          <span className={`font-display font-extrabold tracking-tight ${size === 'lg' ? 'text-2xl sm:text-3xl' : size === 'sm' ? 'text-base' : 'text-lg sm:text-xl'} ${textColor}`}>
            LM <span className="text-amber-500">STORE</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 self-center" />
        </div>
        {variant === 'full' && (
          <span className={`text-[9px] sm:text-[10px] font-bold tracking-wider uppercase mt-0.5 ${subtitleColor}`}>
            Materiais de Construção
          </span>
        )}
      </div>
    </div>
  );
};
