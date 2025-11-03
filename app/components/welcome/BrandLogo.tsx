type Props = { className?: string };

export default function BrandLogo({ className }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="badgeGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3B5BDB" />
            <stop offset="100%" stopColor="#4C6EF5" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#badgeGrad)" />
        <rect x="12" y="17" width="5" height="16" rx="2.5" fill="#FFFFFF" opacity="0.9" />
        <rect x="20" y="13" width="5" height="20" rx="2.5" fill="#E8EDFF" />
        <rect x="28" y="9"  width="5" height="24" rx="2.5" fill="#D9E2FF" />
      </svg>

      <span className="text-[20px] lg:text-[28px] font-semibold text-[#1977F3]">
        FinanceBro
      </span>
    </div>
  );
}
