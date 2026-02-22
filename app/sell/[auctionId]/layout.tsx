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
      {/* IMPORTANT: isolate this layout from global header/footer */}
      <div className="relative z-0">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* LEFT — FORM */}
            <div className="min-w-0">
              {children}
            </div>

            {/* RIGHT — PREVIEW */}
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