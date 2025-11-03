export default function PhoneMockup() {
  return (
    <div className="relative flex justify-center">
      {/* # Mobil */}
      <div className="relative w-[280px] lg:w-[320px] h-[520px] lg:h-[560px] rounded-[32px] bg-white shadow-[0_20px_45px_rgba(0,0,0,0.25)] ring-1 ring-black/5 overflow-hidden">
        {/* # Notch */}
        <div className="mx-auto mt-4 h-5 w-28 rounded-full bg-black/10" />

        {/* # Hlavička karty */}
        <div className="px-5 pt-5">
          <div className="flex items-start justify-between">
            <div className="text-black/90">
              <div className="text-lg lg:text-xl font-extrabold leading-tight">
                Account Balance
              </div>
              <div className="text-xs lg:text-sm text-black/60 mt-0.5">
                1 043 545.00 CZK
              </div>
            </div>

            {/* # Donut graf */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              aria-hidden
              className="shrink-0"
            >
              <circle cx="24" cy="24" r="20" fill="#f2f6ff" />
              <circle
                cx="24"
                cy="24"
                r="14"
                fill="none"
                stroke="#1977F3"
                strokeWidth="7"
                strokeDasharray="36 100"
                strokeLinecap="round"
                transform="rotate(-90 24 24)"
              />
              <circle
                cx="24"
                cy="24"
                r="14"
                fill="none"
                stroke="#2DB6F5"
                strokeWidth="7"
                strokeDasharray="24 112"
                strokeLinecap="round"
                transform="rotate(-30 24 24)"
              />
              <circle
                cx="24"
                cy="24"
                r="14"
                fill="none"
                stroke="#7CC4FF"
                strokeWidth="7"
                strokeDasharray="18 118"
                strokeLinecap="round"
                transform="rotate(20 24 24)"
              />
              <circle cx="24" cy="24" r="10" fill="white" />
            </svg>
          </div>

          {/* # Zelený chip */}
          <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white shadow px-3 py-2 ring-1 ring-black/5">
            <span className="inline-grid h-6 w-6 place-items-center rounded-lg bg-[#14c38e]/15 text-[#14c38e]">
              ↑
            </span>
            <div className="text-xs lg:text-sm leading-3 text-black/80">
              <div className="font-semibold">+ 10,594 CZK</div>
              <div className="text-black/50 text-[11px] lg:text-xs">this month</div>
            </div>
          </div>
        </div>

        {/* # Vlna */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          height="300"
          viewBox="0 0 320 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            {/* přechod od bílé do tmavě modré */}
            <linearGradient id="waveFill" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#4B84E8" />
              <stop offset="100%" stopColor="#0A66E8" />
            </linearGradient>

            {/* modrá horní linka */}
            <linearGradient id="waveStroke" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#2D7FF5" />
              <stop offset="100%" stopColor="#77B7FF" />
            </linearGradient>
          </defs>

          {/* zvýšená vlna (75 % výšky) */}
          <path
            d="M 0 240 C 20 290, 60 80, 100 240 C 140 380, 180 60, 220 250 C 250 340, 290 90, 320 200 L 320 300 L 0 300 Z"
            fill="url(#waveFill)"
            opacity="0.98"
          />
          <path
            d="M 0 240 C 20 290, 60 80, 100 240 C 140 380, 180 60, 220 250 C 250 340, 290 90, 320 200"
            stroke="url(#waveStroke)"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />
        </svg>
      </div>
    </div>
  );
}
