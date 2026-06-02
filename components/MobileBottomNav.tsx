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
      href: "/coming-soon",
      label: "Sell",
      icon: PlusSquare,
      primary: true,
    },
    {
      href: "/marketplace-auctions",
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
        border-gray-200
        bg-white/95
        backdrop-blur-xl
        px-2
        pb-[env(safe-area-inset-bottom)]
        md:hidden
      "
    >

      <div className="mx-auto flex max-w-md items-center justify-between py-1.5">

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
                text-[11px]
                font-medium
                transition
                min-w-[56px]
              "
            >

              {item.primary ? (

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-black
                    text-white
                    shadow-md
                    transition
                    active:scale-95
                  "
                >

                  <Icon size={20} />

                </div>

              ) : (

                <div
                  className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    transition
                    ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-500"
                    }
                  `}
                >

                  <Icon size={20} />

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