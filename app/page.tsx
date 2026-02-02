export default function HomePage() {
  return (
    <main className="bg-gradient-to-b from-gray-50 to-white">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-36 pb-28">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-gray-500 mb-6 tracking-wide">
            A Private Marketplace for Real Assets
          </p>

          <h1 className="text-6xl font-semibold tracking-tight text-gray-900">
            Seller-Direct
            <br />
            Real Estate Auctions
          </h1>

          <p className="mt-8 text-xl text-gray-600 leading-relaxed">
            MrBids is a private, seller-direct auction marketplace designed
            for verified buyers and institutional-grade transactions.
          </p>

          {/* BUTTONS */}
          <div className="mt-14 flex items-center gap-10">
            <a
              href="/auctions"
              className="px-10 py-5 bg-black text-white rounded-full text-base font-medium transition shadow-sm hover:bg-gray-900 hover:shadow-md"
            >
              Browse Auctions
            </a>

            <a
              href="/sell"
              className="px-10 py-5 border border-gray-300 rounded-full text-base font-medium bg-white transition hover:border-gray-400 hover:shadow-sm"
            >
              Sell a Property
            </a>
          </div>

          <p className="mt-10 text-xs text-gray-400">
            Private platform • Limited access • Admin-reviewed auctions
          </p>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-t border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-center">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Licensed Escrow
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Funds flow through third-party licensed escrow providers.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Verified Participants
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Buyers and sellers are reviewed prior to participation.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Admin Oversight
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Auctions are monitored to ensure compliance and fairness.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Audit Trail
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Every bid and action is recorded and preserved.
            </p>
          </div>
        </div>
      </section>

      {/* TRUST GRID */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-4 gap-20">
          {[
            {
              title: "Verified Buyers",
              desc: "All buyers undergo identity and access review prior to bidding.",
            },
            {
              title: "Seller Control",
              desc: "Sellers define reserve pricing and retain acceptance authority.",
            },
            {
              title: "Transparent Auctions",
              desc: "Bids are visible, time-stamped, and auditable.",
            },
            {
              title: "Human Oversight",
              desc: "Every auction is actively monitored by platform administrators.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-base font-semibold text-gray-900 tracking-tight">
                {item.title}
              </h3>
              <p className="mt-5 text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
