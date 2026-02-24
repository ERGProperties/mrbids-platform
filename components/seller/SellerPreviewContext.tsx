"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

type PreviewData = {
  title?: string;
  address?: string;
  startingBid?: number;
  bidIncrement?: number;
  endDate?: string;

  // ⭐ NEW — enables Step-3 description preview
  description?: string;
};

type PreviewContextType = {
  previewData: PreviewData;
  setPreviewData: (data: Partial<PreviewData>) => void;
};

const SellerPreviewContext = createContext<
  PreviewContextType | undefined
>(undefined);

export function SellerPreviewProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [previewData, setPreviewState] = useState<PreviewData>({});

  // stable reference (prevents render loops)
  const setPreviewData = useCallback(
    (data: Partial<PreviewData>) => {
      setPreviewState((prev) => ({ ...prev, ...data }));
    },
    []
  );

  return (
    <SellerPreviewContext.Provider
      value={{ previewData, setPreviewData }}
    >
      {children}
    </SellerPreviewContext.Provider>
  );
}

export function useSellerPreview() {
  const context = useContext(SellerPreviewContext);

  if (!context) {
    throw new Error(
      "useSellerPreview must be used inside SellerPreviewProvider"
    );
  }

  return context;
}