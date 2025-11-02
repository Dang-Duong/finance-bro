import BrandLogo from "./BrandLogo";
import Bullets from "./Bullets";
import CTAButton from "./CTAButton";
import PhoneMockup from "./PhoneMockup";

export default function WelcomeScreen() {
  return (
    <main className="min-h-dvh w-full text-white bg-[#1F3141] bg-[radial-gradient(1200px_600px_at_50%_120%,rgba(10,102,232,0.25),transparent)]">
      <div className="mx-auto max-w-7xl px-4 lg:px-12 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-20">
          {/* # Text vpravo na desktopu */}
          <section>
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
              Your Personal<br />Finance guide
            </h1>

            <p className="mt-4 lg:mt-6 text-sm lg:text-base text-white/80 max-w-xl">
              Take control of your finances — track balances, expenses and incomes,
              plan budgets, and achieve your financial goals with ease. FinanceBro
              helps you understand where your money goes and what you can do better.
            </p>

            <div className="mt-6 lg:mt-8">
              <Bullets />
            </div>

            <div className="mt-6 lg:mt-8">
              <CTAButton />
            </div>
          </section>

          {/* # Vizuální strana: logo + telefon */}
          <section className="flex flex-col items-center lg:items-start">
            <div className="mb-8 lg:mb-12">
              <BrandLogo />
            </div>
            <PhoneMockup />
          </section>
        </div>
      </div>
    </main>
  );
}
