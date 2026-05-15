export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">

        <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-6">
          MrBids Marketplace
        </p>

        <h1 className="text-5xl md:text-7xl font-semibold leading-[1.02]">
          Become a Seller
        </h1>

        <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto">
          Apply to become an early seller on the next generation
          of LIVE marketplace auctions.
        </p>

      </section>

      {/* APPLICATION FORM */}
      <section className="pb-32">

        <div className="max-w-3xl mx-auto px-6">

          <div className="border rounded-3xl p-8 md:p-12">

            <form className="space-y-8">

              {/* NAME */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* TIKTOK */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  TikTok Username
                </label>

                <input
                  type="text"
                  placeholder="@username"
                  className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Primary Selling Category
                </label>

                <select
                  className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
                >
                  <option>Jewelry</option>
                  <option>Electronics</option>
                  <option>Sneakers</option>
                  <option>Collectibles</option>
                  <option>Liquidation</option>
                  <option>Luxury Items</option>
                  <option>Storage Finds</option>
                  <option>Other</option>
                </select>
              </div>

              {/* EXPERIENCE */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Tell Us About Your Inventory
                </label>

                <textarea
                  rows={5}
                  placeholder="Describe what you plan to sell..."
                  className="w-full border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full py-5 rounded-full bg-black text-white font-medium hover:opacity-90 transition"
              >
                Submit Seller Application
              </button>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}