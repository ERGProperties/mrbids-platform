"use client";

import { ReactNode } from "react";
import LivePreview from "@/components/seller/LivePreview";
import { SellerPreviewProvider } from "@/components/seller/SellerPreviewContext";

export default function SellFlowLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SellerPreviewProvider>

      {/* CLEAN BASELINE LAYOUT */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* LEFT — FORM */}
            <main className="min-w-0">
              {children}
            </main>

            {/* RIGHT — LIVE PREVIEW */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <LivePreview />
              </div>
            </aside>

          </div>

        </div>
      </div>

    </SellerPreviewProvider>
  );
}