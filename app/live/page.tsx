export default function LivePage() {
  return (
    <main className="min-h-screen bg-white">

      <section className="max-w-7xl mx-auto px-6 pt-32 pb-24">

        <div className="max-w-3xl">

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-8">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

            <span className="text-sm font-medium text-red-700">
              LIVE Marketplace Auctions
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-semibold leading-[1.02]">
            LIVE Auctions
          </h1>

          <p className="mt-10 text-xl text-gray-600">
            Watch high-energy LIVE auctions featuring liquidation deals,
            luxury items, collectibles, electronics, jewelry, and more.
          </p>

        </div>

      </section>

      <section className="border-t">

        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="grid md:grid-cols-3 gap-10">

            {[
              {
                title: "Luxury Jewelry Drop",
                image:
                  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop",
                viewers: "214 viewers",
              },
              {
                title: "Sneaker Heat Auction",
                image:
                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
                viewers: "487 viewers",
              },
              {
                title: "Electronics Liquidation",
                image:
                  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
                viewers: "352 viewers",
              },
            ].map((auction) => (

              <div
                key={auction.title}
                className="group border rounded-3xl overflow-hidden hover:shadow-xl transition"
              >

                <div className="relative h-72 overflow-hidden">

                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-red-600 text-white">
                      LIVE
                    </span>
                  </div>

                </div>

                <div className="p-7">

                  <h2 className="text-2xl font-semibold">
                    {auction.title}
                  </h2>

                  <p className="mt-4 text-sm text-gray-500">
                    {auction.viewers}
                  </p>

                  <button className="mt-6 px-6 py-3 bg-black text-white rounded-full text-sm">
                    Watch LIVE
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