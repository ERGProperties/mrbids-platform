export default function RequestAccessPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24">
        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-4xl font-semibold text-gray-900">
            Request Buyer Access
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            MrBids is a private, seller-direct real estate auction
            platform. Participation is limited to qualified buyers
            who meet verification requirements.
          </p>
        </div>

        {/* ACCESS REQUIREMENTS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900">
            Buyer Eligibility
          </h2>

          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            To protect sellers and maintain auction integrity, all
            buyers must complete a verification process prior to
            bidding.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-gray-600">
            <li>✔ Government-issued ID verification</li>
            <li>✔ Proof of funds or financing capability</li>
            <li>✔ Agreement to binding auction terms</li>
          </ul>

          <p className="mt-6 text-xs text-gray-500">
            Verification requests are reviewed manually by the MrBids
            team. Approval timelines vary based on volume and
            documentation completeness.
          </p>
        </div>

        {/* REQUEST FORM */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-gray-900">
            Submit a Request
          </h2>

          <p className="mt-4 text-sm text-gray-600">
            This request does not guarantee access. Approved buyers
            will receive an invitation to complete verification.
          </p>

          <form className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Jane Smith"
                className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="jane@example.com"
                className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Buyer Type
              </label>
              <select className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400">
                <option>Individual Investor</option>
                <option>Institutional Buyer</option>
                <option>Developer</option>
                <option>Owner-Operator</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes (optional)
              </label>
              <textarea
                rows={4}
                placeholder="Briefly describe your investment focus or intended use."
                className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            <button
              type="button"
              className="w-full mt-4 py-4 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* FOOTNOTE */}
        <p className="mt-12 text-xs text-gray-400 leading-relaxed">
          MrBids reserves the right to approve or deny access requests
          at its sole discretion. Submission of this form does not
          create any obligation or contractual relationship.
        </p>
      </div>
    </main>
  );
}
