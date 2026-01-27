export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* BRAND */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              MrBids
            </h3>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              A seller-direct real estate auction platform built for
              transparency, control, and verified capital.
            </p>
          </div>

          {/* PLATFORM */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>Browse Auctions</li>
              <li>Sell a Property</li>
              <li>Private Beta</li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Disclosures</li>
            </ul>
          </div>

          {/* TRUST */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Trust & Compliance
            </h4>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              All auctions are subject to identity verification,
              admin review, and escrow-controlled fund flows.
            </p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} MrBids. All rights reserved.
          </p>

          <p className="text-xs text-gray-400">
            Private marketplace • Limited access • Admin-reviewed
          </p>
        </div>
      </div>
    </footer>
  );
}
