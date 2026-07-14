import Link from "next/link";

type Props = {
  username?: string | null;
};

export default function QuickActions({
  username,
}: Props) {
  return (
    <section className="mt-12">

      <h2 className="text-2xl font-semibold mb-6">
        Quick Actions
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <Link
          href="/marketplace-sell"
          className="rounded-3xl border bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="text-3xl mb-4">➕</div>

          <h3 className="text-lg font-semibold">
            Create Auction
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            List a new item for auction.
          </p>
        </Link>

        {username && (
          <Link
            href={`/seller/${username}`}
            className="rounded-3xl border bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="text-3xl mb-4">🏪</div>

            <h3 className="text-lg font-semibold">
              View Storefront
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              See what buyers see.
            </p>
          </Link>
        )}

        <Link
          href="/account/profile"
          className="rounded-3xl border bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="text-3xl mb-4">👤</div>

          <h3 className="text-lg font-semibold">
            Edit Profile
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Update your public seller profile.
          </p>
        </Link>

        <Link
          href="/dashboard#seller-payouts"
          className="rounded-3xl border bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="text-3xl mb-4">💳</div>

          <h3 className="text-lg font-semibold">
            Seller Payouts
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Manage your Stripe account and payouts.
          </p>
        </Link>

      </div>

    </section>
  );
}