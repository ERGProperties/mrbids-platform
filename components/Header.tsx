import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center">
          <Image
            src="/mrbids-logo-transparent.png"
            alt="MrBids"
            width={320}
            height={320}
            className="h-16 w-auto transition-transform duration-300 ease-out hover:scale-[1.04]"
            priority
          />
        </div>

        {/* NAV */}
        <nav className="flex items-center gap-10 text-sm font-medium text-gray-700">
          <Link href="/auctions" className="hover:text-black transition">
            Browse Auctions
          </Link>
          <Link href="/sell" className="hover:text-black transition">
            Sell a Property
          </Link>
          <span className="px-4 py-1.5 rounded-full text-xs border border-gray-300 text-gray-600">
            Private Beta
          </span>
        </nav>
      </div>
    </header>
  );
}
