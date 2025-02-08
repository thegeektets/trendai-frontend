import darkLogo from "@/assets/logo.png";
import logo from "@/assets/logo.png";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-8 max-w-[10.847rem]">
      <Image
        src={logo}
        fill
        className="dark:hidden"
        alt="TrendAi logo"
        role="presentation"
        quality={100}
      />

      <Image
        src={darkLogo}
        fill
        className="hidden dark:block"
        alt="TrendAi logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
