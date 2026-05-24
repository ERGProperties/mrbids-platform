import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Dispute Policy | MrBids",
  description:
    "Review the refund, dispute, chargeback, and transaction policies governing marketplace purchases and auctions on MrBids.",
};

export default function RefundPolicyPage() {

  return (

    <main className="max-w-5xl mx-auto px-6 py-32">

      <div className="mb-14">

        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
          Refund & Dispute Policy
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          Effective Date: May 2026
        </p>

      </div>

      <div className="space-y-14 text-gray-700 leading-relaxed">

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            1. Marketplace Transactions
          </h2>

          <p>
            MrBids operates as a marketplace platform connecting buyers
            and independent sellers through real-time auctions and
            marketplace transactions.
          </p>

          <p className="mt-4">
            Unless explicitly stated otherwise, MrBids is not the direct
            seller of listed marketplace items.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            2. Binding Auction Sales
          </h2>

          <p>
            All winning bids placed through the platform are considered
            binding commitments to purchase.
          </p>

          <p className="mt-4">
            Buyers are responsible for completing payment promptly after
            winning an auction.
          </p>

          <p className="mt-4">
            Failure to complete payment may result in account suspension,
            cancellation of auction privileges, or permanent removal from
            the platform.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            3. Refund Eligibility
          </h2>

          <p>
            Refund eligibility may depend on the circumstances of the
            transaction, seller cooperation, payment processor rules, and
            available evidence.
          </p>

          <p className="mt-4">
            Refunds are not automatically guaranteed simply because a
            buyer changes their mind after an auction ends.
          </p>

          <p className="mt-4">
            Potential refund situations may include:
          </p>

          <ul className="mt-5 space-y-3 list-disc pl-6">

            <li>
              Non-delivery of purchased items
            </li>

            <li>
              Significantly inaccurate or fraudulent listings
            </li>

            <li>
              Unauthorized transactions
            </li>

            <li>
              Proven seller misconduct or fraud
            </li>

          </ul>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            4. Seller Responsibilities
          </h2>

          <p>
            Sellers are responsible for:
          </p>

          <ul className="mt-5 space-y-3 list-disc pl-6">

            <li>
              Accurately describing listed items
            </li>

            <li>
              Shipping sold items within a reasonable timeframe
            </li>

            <li>
              Providing valid tracking information when available
            </li>

            <li>
              Fulfilling completed transactions in good faith
            </li>

          </ul>

          <p className="mt-4">
            Sellers may be subject to account restrictions, payout holds,
            or removal from the platform for fulfillment failures or
            policy violations.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            5. Shipping Disputes
          </h2>

          <p>
            Buyers and sellers are encouraged to communicate directly
            regarding shipping updates, delivery issues, and fulfillment
            concerns.
          </p>

          <p className="mt-4">
            MrBids may review tracking information, communication records,
            and transaction activity when evaluating disputes.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            6. Chargebacks & Payment Disputes
          </h2>

          <p>
            Fraudulent chargebacks, abuse of payment disputes, or misuse
            of financial institutions may result in account suspension or
            permanent removal from the platform.
          </p>

          <p className="mt-4">
            MrBids reserves the right to cooperate with payment processors,
            financial institutions, and law enforcement regarding fraud
            investigations or disputed transactions.
          </p>

          <p className="mt-4">
            Payouts associated with disputed transactions may be delayed,
            reversed, or withheld while investigations are pending.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            7. Platform Discretion
          </h2>

          <p>
            MrBids reserves the right to investigate disputes, suspend
            transactions, remove listings, limit account activity, or
            take enforcement actions when suspicious activity, fraud, or
            policy violations are identified.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            8. Limitation of Liability
          </h2>

          <p>
            MrBids is provided on an “as-is” and “as-available” basis.
          </p>

          <p className="mt-4">
            To the fullest extent permitted by law, MrBids shall not be
            liable for indirect, incidental, consequential, or punitive
            damages arising from marketplace transactions, shipping
            disputes, seller conduct, or buyer conduct.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            9. Policy Updates
          </h2>

          <p>
            MrBids may update this Refund & Dispute Policy at any time.
            Continued use of the platform after updates become effective
            constitutes acceptance of the revised policy.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            10. Contact
          </h2>

          <p>
            Questions regarding refunds, disputes, or this policy may be
            sent to:
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