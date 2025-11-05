import Image from "next/image";
import BrandLogo from "../welcome/BrandLogo";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-primary-dark relative">
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center p-8 lg:p-12">
          <div className="flex mr-12 pb-12 z-10">
            <BrandLogo />
          </div>
          <div className="items-center justify-center hidden lg:flex">
            <Image
              src="/imgs/loginImg.png"
              alt="Finance app illustration"
              width={600}
              height={600}
              className="w-[500px] h-auto"
              priority
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
