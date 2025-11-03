import Image from "next/image";
import BrandLogo from "./BrandLogo";
import Bullets from "./Bullets";
import CTAButton from "./CTAButton";
import PhoneMockup from "./PhoneMockup";

export default function WelcomeScreen() {
  return (
    <main className="min-h-dvh w-full text-white bg-[#1F3141] bg-[radial-gradient(1200px_600px_at_50%_120%,rgba(10,102,232,0.25),transparent)] relative">
      <div className="mx-auto max-w-7xl px-4 lg:px-12 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-20">
          {/* # Text vpravo na desktopu */}
          <section className="text-center lg:text-left">
            {/* Logo - show on mobile only, hide on desktop */}
            <div className="mb-8 lg:hidden flex justify-center">
              <BrandLogo />
            </div>

            <h1 className="hidden lg:block text-3xl lg:text-5xl font-bold leading-tight">
              Your Personal
              <br />
              Finance guide
            </h1>

            <p className="hidden lg:block mt-4 lg:mt-6 text-sm lg:text-base text-white/80 max-w-xl mx-auto lg:mx-0">
              Take control of your finances — track balances, expenses and
              incomes, plan budgets, and achieve your financial goals with ease.
              FinanceBro helps you understand where your money goes and what you
              can do better.
            </p>

            <div className="mt-6 lg:mt-8 flex justify-center lg:justify-start">
              <Bullets />
            </div>

            <div className="mt-6 lg:mt-8 flex justify-center lg:justify-start">
              <CTAButton />
            </div>
          </section>

          {/* # Vizuální strana: logo + telefon */}
          <section className="flex flex-col items-center">
            {/* Logo - hide on mobile, show on desktop */}
            <div className="hidden lg:block mb-6 lg:mb-24">
              <BrandLogo />
            </div>
            {/* Phone mockup - hide on mobile, show on desktop */}
            <div className="hidden lg:block">
              <PhoneMockup />
            </div>
          </section>
        </div>
      </div>

      {/* Welcome graph - show on mobile only, positioned at bottom */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 w-full flex justify-center overflow-hidden pointer-events-none">
        <Image
          src="/welcomeGraph.svg"
          alt="Welcome graph"
          width={392}
          height={291}
          className="w-full max-w-[392px] h-auto"
        />
      </div>
    </main>
  );
}
