export default function HomePage() {
  return (
    <main className="bg-gradient-to-b from-gray-50 to-white">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-36 pb-40">
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
          <div className="mt-14 flex items-center">
            <a
              href="/auctions"
              className="px-10 py-5 bg-black text-white rounded-full text-base font-medium transition shadow-sm hover:bg-gray-900 hover:shadow-md"
            >
              Browse Live Auctions
            </a>

            {/* HARD SPACING */}
            <div className="w-14" />

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

      {/* CREDIBILITY BAND */}
      <section className="border-t border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-500">
            Designed for professional investors, asset managers, and property operators.
          </p>

          <div className="flex items-center gap-10 text-xs uppercase tracking-widest text-gray-400">
            <span>Institutional Buyers</span>
            <span>Licensed Escrow</span>
            <span>Admin Oversight</span>
            <span>Audit Trail</span>
          </div>
        </div>
      </section>

      {/* TRUST GRID */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-4 gap-20">
          {[
            {
              title: "Verified Participants",
              desc: "All buyers undergo identity and capital verification prior to bidding.",
            },
            {
              title: "Escrow-Controlled Funds",
              desc: "Transactions are structured to move directly into licensed escrow.",
            },
            {
              title: "Permanent Audit Trail",
              desc: "Every bid, action, and outcome is recorded and preserved.",
            },
            {
              title: "Human Oversight",
              desc: "Auctions are actively monitored to ensure compliance and fairness.",
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
