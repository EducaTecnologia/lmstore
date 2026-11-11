import React from 'react';

export const BrandLogoSVG: React.FC<{ type: string; className?: string }> = ({ type, className = 'w-auto h-7' }) => {
  switch (type) {
    case 'bosch':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bosch Magneto Emblem */}
          <circle cx="20" cy="20" r="16" stroke="#EA1D25" strokeWidth="4" />
          <rect x="8" y="18" width="24" height="4" fill="#EA1D25" />
          <circle cx="20" cy="20" r="5" fill="#EA1D25" />
          {/* Bosch Wordmark */}
          <text x="45" y="27" fontFamily="'Arial Black', 'Impact', sans-serif" fontWeight="900" fontSize="24" fill="#EA1D25" letterSpacing="1.5">
            BOSCH
          </text>
        </svg>
      );

    case 'dewalt':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="156" height="32" rx="4" fill="#FEBD17" />
          <text x="80" y="27" fontFamily="'Impact', 'Arial Black', sans-serif" fontWeight="900" fontSize="23" fill="#000000" textAnchor="middle" letterSpacing="1.5">
            DEWALT
          </text>
        </svg>
      );

    case 'tigre':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tigre Paw/Claw icon */}
          <path d="M12 28C10 24 10 18 14 14C18 10 24 10 26 14C28 18 28 24 24 28" fill="#F37021" />
          <circle cx="14" cy="10" r="3" fill="#F37021" />
          <circle cx="21" cy="7" r="3" fill="#F37021" />
          <circle cx="28" cy="10" r="3" fill="#F37021" />
          {/* Tigre Wordmark */}
          <text x="40" y="28" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="24" fill="#005CA9" letterSpacing="1">
            TIGRE
          </text>
        </svg>
      );

    case 'votoran':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="6" width="30" height="28" rx="4" fill="#C4161C" />
          <path d="M10 12L19 28L28 12" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <text x="42" y="27" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="21" fill="#C4161C" letterSpacing="0.5">
            VOTORAN
          </text>
        </svg>
      );

    case 'suvinil':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="14" fill="#FF5500" />
          <path d="M15 16C15 13 25 13 25 18C25 24 15 22 15 26C15 28 25 28 25 25" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <text x="42" y="27" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="22" fill="#FF5500" letterSpacing="0.5">
            Suvinil
          </text>
        </svg>
      );

    case 'gerdau':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8H28V16H14V24H28V32H6Z" fill="#004B87" />
          <text x="36" y="28" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="22" fill="#004B87" letterSpacing="1">
            GERDAU
          </text>
        </svg>
      );

    case 'portobello':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="8" y="26" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="20" fill="#0F172A" letterSpacing="2">
            PORTOBELLO
          </text>
          <line x1="8" y1="31" x2="152" y2="31" stroke="#E2E8F0" strokeWidth="1.5" />
        </svg>
      );

    case 'sil':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="20" r="14" fill="#00833E" />
          <path d="M11 16H25M11 20H23M13 24H25" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <text x="38" y="27" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="23" fill="#00833E" letterSpacing="1">
            SIL
          </text>
          <text x="86" y="27" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="10" fill="#64748B">
            FIOS E CABOS
          </text>
        </svg>
      );

    case 'brasilit':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="18,6 32,32 4,32" fill="#00843D" />
          <polygon points="18,12 28,30 8,30" fill="#FFFFFF" />
          <polygon points="18,17 24,28 12,28" fill="#D9222A" />
          <text x="38" y="27" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="21" fill="#00843D" letterSpacing="0.5">
            Brasilit
          </text>
        </svg>
      );

    case 'quartzolit':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="18,6 30,13 30,27 18,34 6,27 6,13" fill="#F5A623" />
          <text x="18" y="25" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="16" fill="#000000" textAnchor="middle">
            Q
          </text>
          <text x="36" y="26" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="18" fill="#1E293B" letterSpacing="0.5">
            quartzolit
          </text>
        </svg>
      );

    case 'deca':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="24" height="24" rx="3" fill="#0F172A" />
          <circle cx="16" cy="20" r="6" fill="#FFFFFF" />
          <text x="36" y="27" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="24" fill="#0F172A" letterSpacing="2">
            Deca
          </text>
        </svg>
      );

    case 'coral':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Coral Ribbon Accent */}
          <path d="M6 14C14 8 20 28 32 16" stroke="#0033A0" strokeWidth="4" strokeLinecap="round" />
          <path d="M8 20C16 14 22 34 34 22" stroke="#FF5500" strokeWidth="3" strokeLinecap="round" />
          <text x="40" y="27" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="24" fill="#0033A0" fontStyle="italic">
            Coral
          </text>
        </svg>
      );

    case 'makita':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="10" y="27" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="24" fill="#008C99" fontStyle="italic" letterSpacing="1">
            makita
          </text>
        </svg>
      );

    case 'vedacit':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="6" width="28" height="28" rx="6" fill="#F26522" />
          <path d="M18 10C18 10 12 17 12 21C12 24.3 14.7 27 18 27C21.3 27 24 24.3 24 21C24 17 18 10 18 10Z" fill="#FFFFFF" />
          <text x="38" y="27" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="21" fill="#F26522" letterSpacing="1">
            VEDACIT
          </text>
        </svg>
      );

    case 'amanco':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="20" r="14" fill="#00A651" />
          <path d="M12 20L17 25L25 15" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="38" y="22" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="17" fill="#00A651" letterSpacing="0.5">
            AMANCO
          </text>
          <text x="38" y="32" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="11" fill="#005CA9" letterSpacing="1">
            wavin
          </text>
        </svg>
      );

    case 'schneider':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="6" width="28" height="28" rx="4" fill="#3DCD58" />
          <circle cx="18" cy="20" r="7" stroke="#FFFFFF" strokeWidth="3" />
          <text x="38" y="21" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="14" fill="#166534">
            Schneider
          </text>
          <text x="38" y="31" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600" fontSize="9" fill="#166534">
            Electric
          </text>
        </svg>
      );

    case 'vonder':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="6" width="32" height="28" rx="3" fill="#F5B324" />
          <text x="18" y="26" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="19" fill="#000000" textAnchor="middle">
            v
          </text>
          <text x="40" y="27" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="21" fill="#000000" letterSpacing="1">
            vonder
          </text>
        </svg>
      );

    case 'eliane':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="10" y="26" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="22" fill="#0F172A" letterSpacing="2.5">
            eliane
          </text>
          <text x="105" y="26" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="500" fontSize="11" fill="#64748B">
            Pisos
          </text>
        </svg>
      );

    case 'fortlev':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="20" r="14" fill="#0065B3" />
          <path d="M10 24C14 20 22 20 26 24" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 18C15 15 21 15 24 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <text x="38" y="27" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="20" fill="#0065B3" letterSpacing="0.5">
            FORTLEV
          </text>
        </svg>
      );

    case 'arcelor':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="20" r="13" stroke="#FF5E00" strokeWidth="4" />
          <path d="M12 26L24 14" stroke="#FF5E00" strokeWidth="3" strokeLinecap="round" />
          <text x="36" y="21" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="13" fill="#C2410C">
            ArcelorMittal
          </text>
          <text x="36" y="31" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600" fontSize="9" fill="#64748B">
            Aços para Construção
          </text>
        </svg>
      );

    case 'lorenzetti':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="20" r="12" fill="#005BA6" />
          <text x="16" y="25" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF" textAnchor="middle">
            L
          </text>
          <text x="34" y="26" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="16" fill="#005BA6" letterSpacing="0.5">
            LORENZETTI
          </text>
        </svg>
      );

    case 'tekbond':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="24" height="24" rx="4" fill="#004F9F" />
          <path d="M10 20H22M16 14V26" stroke="#E52322" strokeWidth="3.5" strokeLinecap="round" />
          <text x="34" y="27" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="19" fill="#004F9F" letterSpacing="0.5">
            Tekbond
          </text>
        </svg>
      );

    case 'sasazaki':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="20" r="12" fill="#B82025" />
          <rect x="12" y="16" width="8" height="8" fill="#FFFFFF" />
          <text x="34" y="27" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="18" fill="#B82025" letterSpacing="1">
            SASAZAKI
          </text>
        </svg>
      );

    case '3m':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="12" y="30" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="32" fill="#EE0000" letterSpacing="-1">
            3M
          </text>
          <text x="75" y="22" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="12" fill="#0F172A">
            Segurança
          </text>
          <text x="75" y="32" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="500" fontSize="9" fill="#64748B">
            e Abrasivos
          </text>
        </svg>
      );

    default:
      return (
        <span className="font-bold text-sm text-slate-800 tracking-wide uppercase">
          {type}
        </span>
      );
  }
};
