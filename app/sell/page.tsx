"use client";

export default function SellPage() {
  const handleSubmit = (e) => {
    e.preventDefault(); // VERY IMPORTANT
    const formData = new FormData(e.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      address: formData.get("address"),
      propertyType: formData.get("propertyType"),
      notes: formData.get("notes"),
    };

    console.log("SUBMIT FIRED ✅", data);

    alert("Listing request submitted (beta). Check console for data.");
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24">
        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-4xl font-semibold text-gray-900">
            Sell a Property via Auction
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            MrBids offers a controlled, seller-direct auction process
            designed to attract verified buyers and transparent price
            discovery.
          </p>
        </div>

        {/* WHY AUCTION */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Why List on MrBids
          </h2>

          <ul className="mt-6 space-y-4 text-sm text-gray-600">
            <li>✔ Retain control over reserve pricing and acceptance</li>
            <li>✔ Access a pool of verified, qualified buyers</li>
            <li>✔ Transparent auction mechanics with admin oversight</li>
            <li>✔ Funds flow directly to licensed escrow</li>
          </ul>

          <p className="mt-6 text-xs text-gray-500">
            Listings are curated to ensure quality and buyer confidence.
          </p>
        </div>

        {/* SELLER REQUIREMENTS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Seller Requirements
          </h2>

          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            To protect all participants, sellers must meet basic
            eligibility standards prior to auction approval.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-gray-600">
            <li>✔ Proof of ownership or authority to sell</li>
            <li>✔ Clear or resolvable title</li>
            <li>✔ Agreement to auction rules and disclosures</li>
          </ul>
        </div>

        {/* SELLER FORM */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-gray-900">
            Submit a Listing Request
          </h2>

          <p className="mt-4 text-sm text-gray-600">
            Submission does not guarantee acceptance. Approved sellers
            will be contacted to complete onboarding and listing setup.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Address
              </label>
              <input
                name="address"
                type="text"
                placeholder="123 Main St, City, State"
                required
                className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                name="propertyType"
                required
                className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              >
                <option value="">Select one</option>
                <option>Single-Family</option>
                <option>Multi-Family</option>
                <option>Condominium</option>
                <option>Land</option>
                <option>Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes (optional)
              </label>
              <textarea
                name="notes"
                rows={4}
                placeholder="Briefly describe the property or any relevant details."
                className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-4 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Submit Listing Request
            </button>
          </form>
        </div>

        {/* FOOTNOTE */}
        <p className="mt-12 text-xs text-gray-400 leading-relaxed">
          MrBids reserves the right to approve, modify, or decline
          listing requests at its discretion. Submission does not
          constitute a listing agreement.
        </p>
      </div>
    </main>
  );
}
