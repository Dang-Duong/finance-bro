export default function Bullets() {
  return (
    <ul className="space-y-3 text-[15px] lg:text-base text-white/90">
      <li className="grid grid-cols-[24px_1fr] items-center gap-3">
        <span className="w-6 text-center">📊</span>
        <span>View your <span className="font-semibold">spending at a glance</span></span>
      </li>
      <li className="grid grid-cols-[24px_1fr] items-center gap-3">
        <span className="w-6 text-center">📅</span>
        <span>Get alerts for <span className="font-semibold">upcoming bills</span></span>
      </li>
      <li className="grid grid-cols-[24px_1fr] items-center gap-3">
        <span className="w-6 text-center">💡</span>
        <span><span className="font-semibold">Smart tips</span> to save and plan</span>
      </li>
    </ul>
  );
}
