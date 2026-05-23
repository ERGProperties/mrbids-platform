export default function PaymentCancelledPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">

      <div className="max-w-xl w-full border rounded-3xl p-10 text-center">

        <div className="text-6xl mb-6">
          ⚠️
        </div>

        <h1 className="text-4xl font-semibold mb-4">
          Payment Cancelled
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed">
          Your payment was cancelled.
          You can return to the auction and complete payment at any time.
        </p>

        <a
          href="/"
          className="inline-flex mt-8 px-8 py-4 rounded-full bg-black text-white font-medium hover:opacity-90 transition"
        >
          Return Home
        </a>

      </div>

    </main>
  );
}