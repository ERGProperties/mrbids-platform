export default function WaterDamagePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">

        {/* BRAND */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">
            24/7 Water Damage Help
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Serving Your Area • 24/7 Emergency Response
          </p>
        </div>

        {/* HERO */}
        <div className="bg-white p-6 rounded-2xl shadow-md">

          <h1 className="text-2xl font-bold text-center mb-2">
            Water Damage? Get Immediate Help Near You
          </h1>

          <p className="text-center text-gray-600 mb-4">
            Fast response from local professionals. Available now.
          </p>

          {/* TRUST BADGES */}
          <div className="flex justify-center gap-3 text-xs text-gray-500 mb-4">
            <span>✔ 24/7 Service</span>
            <span>✔ Fast Response</span>
            <span>✔ No Obligation</span>
          </div>

          {/* FORM */}
          <form
            action="https://formspree.io/f/your-form-id"
            method="POST"
            className="flex flex-col gap-3"
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="border border-gray-300 p-3 rounded-lg"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              className="border border-gray-300 p-3 rounded-lg"
            />

            <input
              type="text"
              name="zip"
              placeholder="Zip Code"
              required
              className="border border-gray-300 p-3 rounded-lg"
            />

            <textarea
              name="message"
              placeholder="What happened?"
              rows={3}
              className="border border-gray-300 p-3 rounded-lg"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-lg font-semibold">
              Get Help Now
            </button>
          </form>

          {/* CALL CTA */}
          <a
            href="tel:+1234567890"
            className="block text-center mt-4 text-blue-600 font-semibold"
          >
            Or Call Now
          </a>

          {/* TRUST TEXT */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            We connect you with trusted local water damage specialists.
          </p>

        </div>

        {/* SOCIAL PROOF / URGENCY */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Homeowners are getting help in your area right now
        </p>

      </div>
    </main>
  );
}