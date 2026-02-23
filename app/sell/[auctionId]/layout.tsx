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

      {/* IMPORTANT:
         Do NOT add relative/z-index here.
         It creates a stacking context that blocks header/footer clicks.
      */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* LEFT — FORM */}
            <div className="min-w-0">
              {children}
            </div>

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