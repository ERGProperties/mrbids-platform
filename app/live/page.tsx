export default function LivePage() {
  return (
    <main className="bg-white min-h-screen">

      <section className="max-w-7xl mx-auto px-6 pt-36 pb-24">

        <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-6">
          LIVE Auctions
        </p>

        <h1 className="text-6xl md:text-7xl font-semibold leading-[1.05]">
          LIVE Auctions
        </h1>

        <p className="mt-10 text-xl text-gray-600 max-w-2xl">
          Watch real-time auctions, compete with other bidders,
          and discover exclusive deals starting at $1.
        </p>

      </section>

      <section className="border-t">

        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="grid md:grid-cols-3 gap-10">

            {[1, 2, 3, 4, 5, 6].map((item) => (

              <div
                key={item}
                className="border rounded-3xl overflow-hidden"
              >

                <div className="h-60 bg-gray-100 flex items-center justify-center text-gray-400">
                  LIVE Auction Preview
                </div>

                <div className="p-7">

                  <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-red-100 text-red-700">
                    LIVE NOW
                  </span>

                  <h3 className="mt-4 text-xl font-semibold">
                    LIVE Auction Event
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    Join the bidding and compete live in real time.
                  </p>

                  <div className="mt-6 flex items-center justify-between text-sm">

                    <span className="font-medium">
                      128 viewers
                    </span>

                    <span className="text-gray-500">
                      Ending Soon
                    </span>

                  </div>

                  <button className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-full text-sm">
                    Join LIVE
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}