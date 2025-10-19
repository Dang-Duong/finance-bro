import Link from "next/link";

function FinanceBroLogo() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="badgeGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#3B5BDB" />
          <stop offset="100%" stopColor="#4C6EF5" />
        </linearGradient>
      </defs>

      {/* Jednoduché modré pozadí bez lesku */}
      <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#badgeGrad)" />

      {/* Tři bílé sloupky s lehce modrým odstínem jako v návrhu */}
      <rect x="12" y="17" width="5" height="16" rx="2.5" fill="#FFFFFF" opacity="0.9" />
      <rect x="20" y="13" width="5" height="20" rx="2.5" fill="#E8EDFF" />
      <rect x="28" y="9" width="5" height="24" rx="2.5" fill="#D9E2FF" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-dvh w-full grid place-items-center bg-[radial-gradient(1200px_600px_at_50%_120%,rgba(10,102,232,0.25),transparent)] bg-[#1F3141]">
      <div className="relative w-[360px] h-[760px] rounded-3xl shadow-2xl border border-white/10 overflow-hidden bg-gradient-to-b from-[#1F3141] to-[#0E243F]">
        {/* Vycentrovaný obsah */}
        <div className="relative z-10 pt-16 px-7 flex flex-col items-center text-center">
          {/* Logo + název přesně vycentrované */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <FinanceBroLogo />
              <span className="text-[22px] font-semibold text-[#1977F3]">
                FinanceBro
              </span>
            </div>
          </div>

          {/* Bullets */}
          <div className="mt-6 w-[85%] text-left">
            <ul className="space-y-4 text-[15px] leading-6 text-white/90">
              <li className="grid grid-cols-[24px_1fr] items-center gap-3">
                <span className="w-6 text-center">📊</span>
                <span>
                  View your <span className="font-semibold">spending at a glance</span>
                </span>
              </li>
              <li className="grid grid-cols-[24px_1fr] items-center gap-3">
                <span className="w-6 text-center">📅</span>
                <span>
                  Get alerts for <span className="font-semibold">upcoming bills</span>
                </span>
              </li>
              <li className="grid grid-cols-[24px_1fr] items-center gap-3">
                <span className="w-6 text-center">💡</span>
                <span>
                  <span className="font-semibold">Smart tips</span> to save and plan
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-10 w-full flex justify-center">
            <Link
              href="/auth"
              className="w-[85%] h-11 rounded-xl text-sm font-semibold shadow-xl bg-[#0A66E8] text-white grid place-items-center active:scale-[0.99]"
            >
              Get started
            </Link>
          </div>
        </div>

        {/* GRAF – zůstává */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          height="440"
          viewBox="0 0 360 440"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="fillGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#0E243F" />
              <stop offset="100%" stopColor="#0A66E8" />
            </linearGradient>
          </defs>

          <path
            d="
              M 0 400
              C 18 385, 40 370, 60 365
              C 80 360, 100 330, 120 340
              C 140 350, 160 285, 180 300
              C 200 310, 220 230, 240 260
              C 260 295, 280 190, 300 220
              C 320 250, 340 205, 360 215
              L 360 440 L 0 440 Z
            "
            fill="url(#fillGrad)"
            opacity="0.96"
            shapeRendering="geometricPrecision"
          />
          <path
            d="
              M 0 400
              C 18 385, 40 370, 60 365
              C 80 360, 100 330, 120 340
              C 140 350, 160 285, 180 300
              C 200 310, 220 230, 240 260
              C 260 295, 280 190, 300 220
              C 320 250, 340 205, 360 215
            "
            stroke="#2D7FF5"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      </div>
    </main>
  );
}
