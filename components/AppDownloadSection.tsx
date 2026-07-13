import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";

export default function AppDownloadSection() {
  return (
    <section className="border-y bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
            <span className="text-sm font-semibold text-blue-700">
              📱 Now Available on iPhone & Android
            </span>
          </div>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight">
            Take LIVE Auctions Anywhere
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Bid in real time, receive instant outbid notifications, watch auctions
            end live, and list items for sale directly from your phone.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">

            <Link
              href={APP_LINKS.ios}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/app-store-badge.svg"
                alt="Download on the App Store"
                className="h-14 w-auto transition-transform hover:scale-105"
              />
            </Link>

            <Link
              href={APP_LINKS.android}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/google-play-badge.png"
                alt="Get it on Google Play"
                className="h-14 w-auto transition-transform hover:scale-105"
              />
            </Link>

          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

            <div>
              <div className="text-4xl mb-3">🔔</div>
              <h3 className="font-semibold text-lg">
                Instant Notifications
              </h3>
              <p className="mt-2 text-gray-600">
                Never miss an outbid alert or auction ending.
              </p>
            </div>

            <div>
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-lg">
                Bid Faster
              </h3>
              <p className="mt-2 text-gray-600">
                Place bids in seconds from anywhere.
              </p>
            </div>

            <div>
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-semibold text-lg">
                Win More Auctions
              </h3>
              <p className="mt-2 text-gray-600">
                Stay connected until the final countdown.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}