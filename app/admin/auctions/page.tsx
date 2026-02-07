import { auctions } from "@/app/auctions/data/auctions";

export default function AdminAuctionsPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Admin • Read Only
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-gray-900">
            Auction Control Panel
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            This panel reflects the current state of all auctions on
            MrBids. Changes are controlled via the auction data file.
          </p>
        </div>

        {/* AUCTION TABLE */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-gray-600">
                  Property
                </th>
                <th className="text-left px-6 py-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 font-medium text-gray-600">
                  Result
                </th>
                <th className="text-left px-6 py-4 font-medium text-gray-600">
                  Auction End
                </th>
                <th className="text-left px-6 py-4 font-medium text-gray-600">
                  Pricing
                </th>
              </tr>
            </thead>

            <tbody>
              {auctions.map((auction) => (
                <tr
                  key={auction.slug}
                  className="border-b border-gray-100 last:border-none"
                >
                  <td className="px-6 py-5">
                    <p className="font-medium text-gray-900">
                      {auction.address}
                    </p>
                    <p className="text-xs text-gray-500">
                      {auction.cityState}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        auction.status === "live"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {auction.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    {auction.result ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {auction.result.replace("_", " ").toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {new Date(auction.endTime).toLocaleString()}
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    <p>Start: {auction.startingBid}</p>
                    <p>Increment: {auction.bidIncrement}</p>
                    <p>ARV: {auction.arv}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EXPLANATION */}
        <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-gray-900">
            How to Control Auctions
          </h2>

          <div className="mt-6 space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              Auction behavior is controlled via the
              <code className="mx-1 px-2 py-1 bg-gray-100 rounded">
                auctions.ts
              </code>
              data file.
            </p>

            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Status:</strong> Set to <code>live</code> or{" "}
                <code>closed</code> to control whether the auction page
                is accessible.
              </li>
              <li>
                <strong>Result:</strong> Set to{" "}
                <code>under_contract</code>, <code>sold</code>, or{" "}
                <code>no_sale</code> to control the result page display.
              </li>
              <li>
                When an auction is marked <code>closed</code>, users are
                automatically redirected to the result page.
              </li>
            </ul>

            <p>
              This panel is read-only by design. No actions are performed
              here to ensure operational safety.
            </p>
          </div>
        </div>

        {/* FOOTNOTE */}
        <p className="mt-12 text-xs text-gray-400">
          Internal administrative view. Not visible to public users.
        </p>
      </div>
    </main>
  );
}
