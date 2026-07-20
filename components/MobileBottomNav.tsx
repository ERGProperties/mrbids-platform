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
      href: "/live",
      label: "LIVE",
      icon: Radio,
    },
    {
      href: "/marketplace-sell",
      label: "Sell",
      icon: PlusSquare,
      primary: true,
    },
    {
      href: "/saved",
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
        border-gray-800
        bg-black/95
        backdrop-blur-2xl
        shadow-[0_-8px_30px_rgba(0,0,0,0.45)]
        px-3
        pb-[env(safe-area-inset-bottom)]
        md:hidden
      "
    >

      <div className="mx-auto flex max-w-md items-end justify-between py-2">

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
                min-w-[58px]
                transition
              "
            >

              {item.primary ? (

                <div
                  className="
                    -mt-5
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white
                    text-black
                    shadow-xl
                    ring-4
                    ring-black
                    transition
                    active:scale-95
                  "
                >

                  <Icon size={24} />

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
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }
                  `}
                >

                  <Icon size={21} />

                </div>

              )}

              <span
                className={`
                  text-[11px]
                  font-medium
                  transition-colors
                  ${
                    isActive
                      ? "text-white"
                      : "text-gray-500"
                  }
                `}
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