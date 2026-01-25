import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/mrbids-logo-transparent.png"
          alt="MrBids"
          width={180}
          height={60}
          priority
        />
      </Link>

      <nav className="flex items-center gap-6">
        <Link href="/buyer" className="text-sm font-medium">
          Browse Auctions
        </Link>
        <Link href="/seller" className="text-sm font-medium">
          Sell a Property
        </Link>
        <span className="text-xs px-3 py-1 rounded-full border">
          Private Beta
        </span>
      </nav>
    </header>
  );
}
