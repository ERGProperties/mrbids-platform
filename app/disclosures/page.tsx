import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclosures | MrBids",
  description:
    "Important disclosures regarding the use of the MrBids marketplace, auction, and real estate platform.",
};

export default function DisclosuresPage() {

  return (

    <main className="max-w-5xl mx-auto px-6 py-32">

      <div className="mb-14">

        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
          Disclosures
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          Effective Date: May 2026
        </p>

      </div>

      <div className="space-y-14 text-gray-700 leading-relaxed">

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            1. Marketplace Platform Disclosure
          </h2>

          <p>
            MrBids operates as a technology platform that facilitates
            marketplace auctions, real-time bidding, real estate listings,
            and transactions between independent users.
          </p>

          <p className="mt-4">
            Unless explicitly stated otherwise, MrBids is not the direct
            seller, owner, manufacturer, distributor, or shipper of
            marketplace items listed by independent sellers.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            2. No Brokerage or Fiduciary Relationship
          </h2>

          <p>
            MrBids does not act as a real estate broker, agent, escrow
            holder, fiduciary, financial advisor, or legal representative
            unless specifically disclosed in writing.
          </p>

          <p className="mt-4">
            Users are solely responsible for conducting their own due
            diligence regarding transactions, listings, properties,
            sellers, buyers, and marketplace activity.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            3. Independent Sellers
          </h2>

          <p>
            Marketplace sellers on MrBids operate independently and are
            responsible for:
          </p>

          <ul className="mt-5 space-y-3 list-disc pl-6">

            <li>
              Listing accuracy
            </li>

            <li>
              Product authenticity
            </li>

            <li>
              Shipping and fulfillment
            </li>

            <li>
              Compliance with applicable laws
            </li>

            <li>
              Customer communications
            </li>

          </ul>

          <p className="mt-4">
            MrBids does not independently verify all seller claims,
            listing details, or product authenticity.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            4. Payments & Stripe Connect
          </h2>

          <p>
            Marketplace payments and seller payouts may be processed
            through third-party payment providers including Stripe.
          </p>

          <p className="mt-4">
            Seller onboarding, payout eligibility, identity verification,
            payment review, and financial compliance requirements may be
            subject to Stripe policies and applicable financial regulations.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            5. Marketplace Fees
          </h2>

          <p>
            MrBids may collect marketplace service fees, transaction fees,
            payout-related fees, or other platform charges associated with
            marketplace activity.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            6. Auction Risks
          </h2>

          <p>
            Participation in auctions involves inherent risks, including
            pricing volatility, competitive bidding activity, fulfillment
            disputes, shipping issues, payment disputes, and potential
            listing inaccuracies.
          </p>

          <p className="mt-4">
            Users participate in marketplace auctions at their own risk.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            7. No Guarantees
          </h2>

          <p>
            MrBids makes no guarantees regarding:
          </p>

          <ul className="mt-5 space-y-3 list-disc pl-6">

            <li>
              Listing accuracy
            </li>

            <li>
              Product authenticity
            </li>

            <li>
              Seller conduct
            </li>

            <li>
              Buyer conduct
            </li>

            <li>
              Shipping outcomes
            </li>

            <li>
              Transaction completion
            </li>

            <li>
              Marketplace availability
            </li>

          </ul>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            8. Limitation of Liability
          </h2>

          <p>
            To the fullest extent permitted by law, MrBids shall not be
            liable for indirect, incidental, consequential, special, or
            punitive damages arising from marketplace activity,
            transactions, auctions, listings, shipping disputes, payment
            disputes, or user conduct.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            9. Contact
          </h2>

          <p>
            Questions regarding these disclosures may be directed to:
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
