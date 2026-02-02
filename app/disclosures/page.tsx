import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclosures | MrBids",
  description:
    "Important disclosures regarding the use of the MrBids seller-direct real estate auction platform.",
};

export default function DisclosuresPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-32">
      <h1 className="text-3xl font-semibold text-gray-900">
        Disclosures
      </h1>

      <p className="mt-8 text-sm text-gray-600 leading-relaxed">
        MrBids is a technology platform facilitating seller-direct real
        estate auctions and does not act as a broker, agent, escrow
        holder, or fiduciary.
      </p>

      <p className="mt-6 text-sm text-gray-600 leading-relaxed">
        Questions regarding disclosures may be directed to{" "}
        <a href="mailto:support@mrbids.com" className="underline">
          support@mrbids.com
        </a>.
      </p>
    </main>
  );
}
