import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | MrBids",
  description:
    "Review the Terms of Service governing access to and use of the MrBids online marketplace and auction platform.",
};

export default function TermsOfServicePage() {

  return (

    <main className="max-w-5xl mx-auto px-6 py-32">

      <div className="mb-14">

        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
          Terms of Service
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          Effective Date: May 2026
        </p>

      </div>

      <div className="space-y-14 text-gray-700 leading-relaxed">

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            1. Acceptance of Terms
          </h2>

          <p>
            By accessing or using MrBids, you agree to be bound by these
            Terms of Service and all applicable laws and regulations. If
            you do not agree to these terms, you may not use the platform.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            2. Marketplace Platform
          </h2>

          <p>
            MrBids operates as an online marketplace platform that allows
            independent users to list, bid on, buy, and sell products
            through auction-based transactions.
          </p>

          <p className="mt-4">
            MrBids is not the direct seller of marketplace items unless
            explicitly identified as such. Transactions occur between
            buyers and independent sellers using the platform.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            3. Eligibility
          </h2>

          <p>
            Users must be at least 18 years old and legally capable of
            entering binding contracts in order to use the platform.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            4. Binding Bids
          </h2>

          <p>
            All bids placed on MrBids are legally binding. By placing a
            bid, you agree to complete the transaction if you become the
            winning bidder.
          </p>

          <p className="mt-4">
            Failure to complete payment may result in account suspension,
            auction cancellation, or permanent removal from the platform.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            5. Payments & Marketplace Fees
          </h2>

          <p>
            Payments are processed securely through third-party payment
            providers including Stripe.
          </p>

          <p className="mt-4">
            MrBids may collect marketplace service fees, transaction fees,
            payout fees, or other platform-related charges from sellers
            and/or buyers.
          </p>

          <p className="mt-4">
            Sellers are responsible for maintaining valid payout
            information and completing any required identity verification
            or onboarding processes.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            6. Seller Responsibilities
          </h2>

          <p>
            Sellers agree to:
          </p>

          <ul className="mt-5 space-y-3 list-disc pl-6">

            <li>
              Accurately describe listed items
            </li>

            <li>
              Ship sold items within a reasonable timeframe
            </li>

            <li>
              Provide valid tracking information when applicable
            </li>

            <li>
              Fulfill all completed transactions
            </li>

            <li>
              Comply with all applicable laws and regulations
            </li>

          </ul>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            7. Prohibited Items & Conduct
          </h2>

          <p>
            Users may not list or sell illegal, counterfeit, stolen,
            fraudulent, dangerous, or prohibited items through the
            platform.
          </p>

          <p className="mt-4">
            MrBids reserves the right to remove listings, suspend
            accounts, cancel transactions, or cooperate with law
            enforcement when necessary.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            8. Shipping & Fulfillment
          </h2>

          <p>
            Sellers are responsible for shipping purchased items to buyers
            using the fulfillment details provided through the platform.
          </p>

          <p className="mt-4">
            Buyers are responsible for providing accurate shipping
            information during checkout.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            9. Disputes & Chargebacks
          </h2>

          <p>
            MrBids may assist in resolving disputes between buyers and
            sellers but does not guarantee outcomes or assume liability
            for user transactions.
          </p>

          <p className="mt-4">
            Users are responsible for complying with payment processor
            rules regarding disputes, chargebacks, and claims.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            10. Account Suspension & Termination
          </h2>

          <p>
            MrBids reserves the right to suspend, restrict, or terminate
            accounts at any time for violations of these terms, suspected
            fraud, abuse, non-payment, or harmful conduct.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            11. Limitation of Liability
          </h2>

          <p>
            MrBids is provided on an “as-is” and “as-available” basis
            without warranties of any kind.
          </p>

          <p className="mt-4">
            To the fullest extent permitted by law, MrBids shall not be
            liable for indirect, incidental, consequential, or punitive
            damages arising from use of the platform or marketplace
            transactions.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            12. Changes to Terms
          </h2>

          <p>
            MrBids may update these Terms of Service at any time. Continued
            use of the platform after changes become effective constitutes
            acceptance of the updated terms.
          </p>

        </section>

        <section>

          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            13. Contact
          </h2>

          <p>
            For questions regarding these Terms of Service, contact:
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