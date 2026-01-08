import Link from "next/link";

export default function CTAButton() {
  return (
    <Link
      href="/signup"
      className="inline-grid place-items-center h-11 px-6 rounded-xl text-sm font-semibold bg-primary text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition cursor-pointer"
    >
      Get started
    </Link>
  );
}
