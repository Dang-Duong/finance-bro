import Image from "next/image";

type Props = { className?: string };

export default function BrandLogo({ className }: Props) {
  return (
    <div className={className ?? ""}>
      <Image
        src="/Logo.svg"
        alt="FinanceBro logo"
        width={517}
        height={116}
        className="h-auto w-[200px] lg:w-[250px]"
        priority
      />
    </div>
  );
}
