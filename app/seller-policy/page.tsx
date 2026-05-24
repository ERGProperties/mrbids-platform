import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Policy | MrBids",
  description:
    "Review the marketplace seller policies, prohibited items, fulfillment standards, and seller responsibilities for using MrBids.",
};

export default function SellerPolicyPage() {

  return (

    <main className="max-w-5xl mx-auto px-6 py-32">

      <div className="mb-14">

        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
          Marketplace Seller Policy
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          Effective Date: May 2026
        </p>

      </div>

      <div className="space-y-14 text-gray-700 leading-relaxed">

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            1. Seller Responsibilities
          </h2>

          <p>
            Sellers using MrBids are responsible for maintaining accurate,
            honest, and lawful marketplace listings.
          </p>

          <p className="mt-4">
            Sellers agree to:
          </p>

          <ul className="mt-5 space-y-3 list-disc pl-6">

            <li>
              Accurately describe all listed items
            </li>

            <li>
              Upload authentic and representative photos
            </li>

            <li>
              Honor completed auction transactions
            </li>

            <li>
              Ship sold items within a reasonable timeframe
            </li>

            <li>
              Maintain valid payout and account information
            </li>

            <li>
              Comply with all applicable laws and regulations
            </li>

          </ul>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            2. Prohibited Items
          </h2>

          <p>
            Sellers may not list prohibited, illegal, dangerous, or
            fraudulent items on MrBids.
          </p>

          <p className="mt-4">
            Prohibited items may include, but are not limited to:
          </p>

          <ul className="mt-5 space-y-3 list-disc pl-6">

            <li>
              Counterfeit or replica products
            </li>

            <li>
              Stolen goods
            </li>

            <li>
              Illegal drugs or controlled substances
            </li>

            <li>
              Firearms, explosives, or dangerous weapons
            </li>

            <li>
              Fraudulent or deceptive listings
            </li>

            <li>
              Recalled or unsafe consumer products
            </li>

            <li>
              Intellectual property infringing goods
            </li>

          </ul>

          <p className="mt-4">
            MrBids reserves the right to remove listings or suspend
            accounts that violate marketplace standards.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            3. Seller Payouts & Stripe Connect
          </h2>

          <p>
            Sellers must complete required Stripe Connect onboarding in
            order to receive marketplace payouts.
          </p>

          <p className="mt-4">
            MrBids may collect marketplace fees, transaction fees, or
            related platform charges from completed sales.
          </p>

          <p className="mt-4">
            Payout timing and availability may depend on Stripe policies,
            payment processor review, disputes, or fraud prevention measures.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            4. Shipping & Fulfillment
          </h2>

          <p>
            Sellers are responsible for securely packaging and shipping
            sold items to buyers using the fulfillment details provided
            through the platform.
          </p>

          <p className="mt-4">
            Sellers should provide valid tracking information whenever
            available and communicate delays promptly.
          </p>

          <p className="mt-4">
            Failure to fulfill completed transactions may result in
            account restrictions or suspension.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            5. Listing Accuracy & Authenticity
          </h2>

          <p>
            Sellers are responsible for ensuring that all listings,
            descriptions, photos, categories, and item conditions are
            accurate and not misleading.
          </p>

          <p className="mt-4">
            Misrepresentation, false advertising, or intentionally
            deceptive listings may result in enforcement action.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            6. Fraud Prevention & Enforcement
          </h2>

          <p>
            MrBids reserves the right to investigate suspicious activity,
            fraudulent transactions, chargebacks, marketplace abuse, or
            policy violations.
          </p>

          <p className="mt-4">
            Enforcement actions may include:
          </p>

          <ul className="mt-5 space-y-3 list-disc pl-6">

            <li>
              Listing removal
            </li>

            <li>
              Temporary payout holds
            </li>

            <li>
              Auction cancellation
            </li>

            <li>
              Account suspension
            </li>

            <li>
              Permanent account termination
            </li>

          </ul>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            7. Disputes & Chargebacks
          </h2>

          <p>
            Sellers may be required to cooperate with transaction reviews,
            disputes, chargebacks, or fraud investigations.
          </p>

          <p className="mt-4">
            MrBids reserves the right to withhold payouts or limit account
            access when disputes or suspicious activity occur.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            8. Policy Updates
          </h2>

          <p>
            MrBids may update this Seller Policy at any time. Continued
            use of the marketplace after updates become effective
            constitutes acceptance of the revised policy.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            9. Contact
          </h2>

          <p>
            Questions regarding this Seller Policy may be sent to:
          </p>

          <p className="mt-4">
            <a
              href="mailto:support@mrbids.com"
              className="underline"
            >
              support@mrbids.com
            </a>
          </p>

        </section>

      </div>

    </main>

  );

}