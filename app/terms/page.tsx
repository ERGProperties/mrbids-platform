import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | MrBids",
  description:
    "Review the Terms of Service governing access to and use of the MrBids seller-direct real estate auction platform.",
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-32">
      <h1 className="text-3xl font-semibold text-gray-900">
        Terms of Service
      </h1>

      <p className="mt-8 text-sm text-gray-600 leading-relaxed">
        These Terms of Service govern access to and use of the MrBids
        platform. By accessing or using the platform, you agree to be
        bound by these terms.
      </p>

      <p className="mt-6 text-sm text-gray-600 leading-relaxed">
        For questions regarding these terms, contact{" "}
        <a href="mailto:support@mrbids.com" className="underline">
          support@mrbids.com
        </a>.
      </p>
    </main>
  );
}
