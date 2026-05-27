"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Pusher from "pusher-js";

type ToastItem = {
  id: string;
  message: string;
};

export default function LiveActivityToasts() {

  const [
    toasts,
    setToasts,
  ] = useState<ToastItem[]>([]);

  const messages =
    useMemo(
      () => [
        "🔥 New bid placed LIVE",
        "⚡ Auction ending soon",
        "💰 New auction launched",
        "🏆 Competitive bidding happening now",
        "📈 Marketplace activity increasing",
      ],
      []
    );

  useEffect(() => {

    const pusher =
      new Pusher(
        process.env.NEXT_PUBLIC_PUSHER_KEY!,
        {
          cluster:
            process.env
              .NEXT_PUBLIC_PUSHER_CLUSTER!,
        }
      );

    const channel =
      pusher.subscribe(
        "marketplace-auctions"
      );

    channel.bind(
      "new-bid",
      (data: any) => {

        const message =
          data?.title
            ? `🔥 ${data.title} bid is now $${data.currentBid}`
            : messages[
                Math.floor(
                  Math.random() *
                    messages.length
                )
              ];

        const id =
          crypto.randomUUID();

        setToasts((prev) => [
          ...prev,
          {
            id,
            message,
          },
        ]);

        setTimeout(() => {

          setToasts((prev) =>
            prev.filter(
              (toast) =>
                toast.id !== id
            )
          );

        }, 4500);

      }
    );

    return () => {

      channel.unbind_all();

      channel.unsubscribe();

      pusher.disconnect();

    };

  }, [messages]);

  return (

    <div className="fixed bottom-28 right-4 z-[100] space-y-3 pointer-events-none">

      {toasts.map((toast) => (

        <div
          key={toast.id}
          className="
            animate-in
            slide-in-from-right
            fade-in
            duration-300
            rounded-2xl
            border
            border-white/20
            bg-black/90
            px-5
            py-4
            text-sm
            font-medium
            text-white
            shadow-2xl
            backdrop-blur-xl
            max-w-[280px]
          "
        >

          {toast.message}

        </div>

      ))}

    </div>

  );

}