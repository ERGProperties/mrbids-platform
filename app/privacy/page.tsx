import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MrBids",
  description:
    "Learn how MrBids collects, uses, and protects personal information on its private real estate auction platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-32">
      <h1 className="text-3xl font-semibold text-gray-900">
        Privacy Policy
      </h1>

      <p className="mt-8 text-sm text-gray-600 leading-relaxed">
        MrBids respects your privacy and is committed to protecting
        personal information collected through the platform.
      </p>

      <p className="mt-6 text-sm text-gray-600 leading-relaxed">
        Privacy questions may be sent to{" "}
        <a href="mailto:support@mrbids.com" className="underline">
          support@mrbids.com
        </a>.
      </p>
    </main>
  );
}
