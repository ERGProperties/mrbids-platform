import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "24/7 Water Damage Help",
  description: "Emergency water damage help near you. Fast 24/7 response.",
  icons: {
    icon: "/water-icon.png", // add this next
  },
};

export default function WaterDamageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}