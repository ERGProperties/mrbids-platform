export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-semibold mb-8">
          Delete Your MrBids Account
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          MrBids users may request deletion of their
          account and associated personal data at any time.
        </p>

        <div className="space-y-6 text-gray-700 leading-8">

          <p>
            To request account deletion, please send an email to:
          </p>

          <p className="text-xl font-semibold text-black">
            support@mrbids.com
          </p>

          <p>
            Include the email address associated with your
            MrBids account and the subject line:
          </p>

          <p className="font-medium">
            "Account Deletion Request"
          </p>

          <p>
            Once verified, your account and associated
            personal information will be permanently deleted
            within 30 days, unless retention is required for:
          </p>

          <ul className="list-disc pl-6 space-y-2">

            <li>
              fraud prevention
            </li>

            <li>
              legal compliance
            </li>

            <li>
              dispute resolution
            </li>

            <li>
              transaction record requirements
            </li>

          </ul>

          <p>
            Certain transactional or legal records may be
            retained where required by law.
          </p>

        </div>

      </div>
    </main>
  );
}