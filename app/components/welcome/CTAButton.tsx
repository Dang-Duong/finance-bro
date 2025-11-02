import Link from "next/link";

export default function CTAButton() {
  return (
    <Link
      href="/auth"
      className="inline-grid place-items-center h-11 px-6 rounded-xl text-sm font-semibold bg-[#0A66E8] text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition"
    >
      Get started
    </Link>
  );
}
