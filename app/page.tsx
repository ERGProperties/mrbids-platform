export default function HomePage() {
  return (
    <main className="px-6 py-20 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold max-w-3xl">
        Seller-Direct Real Estate Auctions
      </h1>

      <p className="mt-6 text-lg max-w-2xl text-gray-600">
        No middlemen. No hidden rules. Real buyers only.
      </p>

      <div className="mt-10 flex gap-4">
        <a
          href="/buyer"
          className="px-6 py-3 bg-black text-white rounded-lg"
        >
          Browse Live Auctions
        </a>
        <a
          href="/seller"
          className="px-6 py-3 border rounded-lg"
        >
          Sell a Property
        </a>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-4 border rounded-xl">
          Verified Buyers Only
        </div>
        <div className="p-4 border rounded-xl">
          Funds Go Directly to Escrow
        </div>
        <div className="p-4 border rounded-xl">
          Immutable Auction Records
        </div>
        <div className="p-4 border rounded-xl">
          Admin-Monitored Auctions
        </div>
      </div>
    </main>
  );
}
