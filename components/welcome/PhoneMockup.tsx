import Image from "next/image";

export default function PhoneMockup() {
  return (
    <div className="relative flex justify-center">
      <Image
        src="/imgs/welcomeImg.png"
        alt="Phone mockup showing finance app"
        width={320}
        height={560}
        className="w-[300px] lg:w-[380px] h-auto"
        priority
      />
    </div>
  );
}
