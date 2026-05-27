"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Radio,
  PlusSquare,
  Heart,
  User,
} from "lucide-react";

export default function MobileBottomNav() {

  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/marketplace-auctions",
      label: "LIVE",
      icon: Radio,
    },
    {
      href: "/create-auction",
      label: "Sell",
      icon: PlusSquare,
      primary: true,
    },
    {
      href: "/watchlist",
      label: "Saved",
      icon: Heart,
    },
    {
      href: "/dashboard",
      label: "Account",
      icon: User,
    },
  ];

  return (

    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        bg-white/95
        backdrop-blur-xl
        px-2
        pb-[env(safe-area-inset-bottom)]
        md:hidden
      "
    >

      <div className="mx-auto flex max-w-md items-center justify-between py-2">

        {navItems.map((item) => {

          const Icon = item.icon;

          const isActive =
            pathname === item.href;

          return (

            <Link
              key={item.href}
              href={item.href}
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-1
                text-xs
                font-medium
                transition
              "
            >

              {item.primary ? (

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-black
                    text-white
                    shadow-lg
                  "
                >

                  <Icon size={26} />

                </div>

              ) : (

                <div
                  className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    transition
                    ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-500"
                    }
                  `}
                >

                  <Icon size={22} />

                </div>

              )}

              <span
                className={
                  isActive
                    ? "text-black"
                    : "text-gray-500"
                }
              >

                {item.label}

              </span>

            </Link>

          );

        })}

      </div>

    </div>

  );

}