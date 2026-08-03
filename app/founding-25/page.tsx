import Link from "next/link";

export default function FoundingCreatorsPage() {
  return (
    <>
      {/* ================= HERO ================= */}

<section className="relative overflow-hidden bg-slate-950">

  {/* Background */}
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.20),transparent_55%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.15),rgba(2,6,23,1))]" />
  </div>

  <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 pt-28 pb-24">

    <div className="mx-auto -mt-12 max-w-4xl text-center">

      {/* Badge */}

      <div className="mb-8 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 backdrop-blur">

        <span className="mr-2 text-lg">👑</span>

        <span className="text-sm font-semibold uppercase tracking-[0.30em] text-emerald-300">
          Exclusive Invitation • Only 25 Founding Creators
        </span>

      </div>

      {/* Headline */}

      <h1 className="text-5xl font-black leading-[1.15] tracking-tight text-white md:text-7xl">

        Become One of the

        <span className="mt-6 block pb-3 bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">

          MrBids Founding 25

        </span>

      </h1>

      {/* Description */}

      <p className="mx-auto mt-10 max-w-3xl text-xl leading-9 text-slate-300 md:text-2xl">

        Launch your own branded auction storefront, grow a loyal buyer community,
        and help shape the future of creator commerce.

      </p>

      {/* Buttons */}

      <div className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row">

        <a
          href="#apply"
          className="rounded-full bg-gradient-to-r from-emerald-500 to-green-400 px-10 py-5 text-lg font-bold text-white shadow-[0_0_35px_rgba(16,185,129,.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_55px_rgba(16,185,129,.65)]"
        >
          Claim Your Founding Spot
        </a>

        <a
          href="#benefits"
          className="rounded-full border border-slate-700 px-10 py-5 text-lg font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-white"
        >
          Explore the Benefits
        </a>

      </div>

      {/* ================= TRUST METRICS ================= */}

<div className="mt-24 grid grid-cols-1 gap-8 border-t border-slate-800 pt-14 md:grid-cols-3">

  {/* Founding Spots */}

  <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center backdrop-blur">

    <div className="text-5xl font-black text-emerald-400">
      25
    </div>

    <div className="mt-3 text-lg font-bold text-white">
      Founding Creator Spots
    </div>

    <p className="mt-3 text-sm leading-6 text-slate-400">
      An exclusive group helping shape the future of the platform.
    </p>

  </div>

  {/* Storefront */}

  <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center backdrop-blur">

    <div className="mb-3 text-5xl">
      🏪
    </div>

    <div className="text-lg font-bold text-white">
      Branded Storefronts
    </div>

    <p className="mt-3 text-sm leading-6 text-slate-400">
      Every creator receives a personalized auction storefront built for their
      community.
    </p>

  </div>

  {/* Live Auctions */}

  <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center backdrop-blur">

    <div className="mb-3 text-5xl">
      🔴
    </div>

    <div className="text-lg font-bold text-white">
      LIVE Auctions
    </div>

    <p className="mt-3 text-sm leading-6 text-slate-400">
      Create excitement with real-time bidding, countdown timers, and engaged
      buyers.
    </p>

  </div>

</div>

    </div>

  </div>

</section>

{/* ================= WHY CREATORS JOIN ================= */}

<section
  id="benefits"
  className="bg-slate-900 py-28"
>
  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
        WHY FOUNDING CREATORS
      </p>

      <h2 className="text-4xl font-black text-white md:text-6xl">
        Stop Building Someone Else&apos;s Platform.
      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-300">
        Every video you create drives traffic to platforms that control your
        audience, your visibility, and your fees.
        <br /><br />
        MrBids gives you your own branded auction storefront where your community
        comes to compete for your products—not someone else&apos;s.
      </p>

    </div>

    <div className="mt-20 grid gap-8 md:grid-cols-3">

      {/* Card 1 */}

      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-10 transition duration-300 hover:-translate-y-2 hover:border-emerald-500">

        <div className="mb-6 text-5xl">
          🏪
        </div>

        <h3 className="text-2xl font-bold text-white">
          Your Own Storefront
        </h3>

        <p className="mt-5 leading-8 text-slate-300">
          Build a branded auction page that showcases your products, your
          personality, and your community. Every auction helps strengthen your
          brand.
        </p>

      </div>

      {/* Card 2 */}

      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-10 transition duration-300 hover:-translate-y-2 hover:border-emerald-500">

        <div className="mb-6 text-5xl">
          🔥
        </div>

        <h3 className="text-2xl font-bold text-white">
          Turn Followers Into Bidders
        </h3>

        <p className="mt-5 leading-8 text-slate-300">
          Instead of fixed-price listings, let your audience compete through live
          bidding—creating excitement, urgency, and stronger engagement around
          every product you sell.
        </p>

      </div>

      {/* Card 3 */}

      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-10 transition duration-300 hover:-translate-y-2 hover:border-emerald-500">

        <div className="mb-6 text-5xl">
          🚀
        </div>

        <h3 className="text-2xl font-bold text-white">
          Grow With Us
        </h3>

        <p className="mt-5 leading-8 text-slate-300">
          Founding Creators receive premium placement, early access to new
          features, referral opportunities, and the ability to help shape the
          future of the platform as it grows.
        </p>

      </div>

    </div>

  </div>
</section>

{/* ================= WHY AUCTIONS ================= */}

<section className="bg-slate-950 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
        THE POWER OF AUCTIONS
      </p>

      <h2 className="text-4xl font-black text-white md:text-6xl">
        Stop Selling.
        <br />
        Start Creating Competition.
      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-300">
        Traditional marketplaces ask one question:
      </p>

      <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <div className="text-3xl font-bold text-white">
          "Will someone buy this?"
        </div>

      </div>

      <p className="mt-12 text-xl leading-9 text-slate-300">
        MrBids asks a different question:
      </p>

      <div className="mt-10 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-8 shadow-[0_0_30px_rgba(16,185,129,.20)]">

        <div className="text-3xl font-bold text-emerald-300">
          "How much are people willing to bid?"
        </div>

      </div>

    </div>

    {/* Feature Grid */}

    <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <div className="mb-5 text-5xl">⚡</div>

        <h3 className="text-xl font-bold text-white">
          Urgency
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          Countdown timers motivate buyers to act instead of waiting.
        </p>

      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <div className="mb-5 text-5xl">🔥</div>

        <h3 className="text-xl font-bold text-white">
          Competition
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          Multiple bidders create excitement around every auction.
        </p>

      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <div className="mb-5 text-5xl">🎯</div>

        <h3 className="text-xl font-bold text-white">
          Engagement
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          Your audience keeps coming back to watch, bid, and compete.
        </p>

      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <div className="mb-5 text-5xl">📈</div>

        <h3 className="text-xl font-bold text-white">
          Momentum
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          Every auction creates anticipation for your next one.
        </p>

      </div>

    </div>

  </div>

</section>

{/* ================= FOUNDING 25 BENEFITS ================= */}

<section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
        FOUNDING CREATOR BENEFITS
      </p>

      <h2 className="text-4xl font-black text-white md:text-6xl">
        Join Early.
        <br />
        Grow Together.
      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-300">
        We&apos;re inviting a small group of creators to help shape MrBids from the
        beginning. Founding Creators receive early benefits that won&apos;t be
        available through the standard onboarding process.
      </p>

    </div>

    <div className="mt-20 overflow-hidden rounded-3xl border border-slate-800">

      <div className="overflow-x-auto">

        <table className="min-w-[700px] w-full">

          <thead className="bg-slate-950">

            <tr>

              <th className="px-8 py-6 text-left text-lg font-bold text-white">
                Benefit
              </th>

              <th className="px-8 py-6 text-center text-lg font-bold text-slate-400">
                Standard Seller
              </th>

              <th className="bg-emerald-500 px-8 py-6 text-center text-lg font-black text-slate-950">
                Founding 25
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-800 bg-slate-900">

            {/* Branded Storefront */}

            <tr>

              <td className="px-8 py-6 text-white">
                Branded Storefront
              </td>

              <td className="text-center">
                <svg className="mx-auto h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </td>

              <td className="text-center">
                <svg className="mx-auto h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </td>

            </tr>

            {/* Featured Placement */}

            <tr>

              <td className="px-8 py-6 text-white">
                Featured Placement
              </td>

              <td className="text-center">
                <svg className="mx-auto h-7 w-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </td>

              <td className="text-center">
                <svg className="mx-auto h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </td>

            </tr>

            {/* Reduced Selling Fees */}

            <tr>

              <td className="px-8 py-6 text-white">
                Reduced Selling Fees
              </td>

              <td className="text-center">
                <svg className="mx-auto h-7 w-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </td>

              <td className="text-center">
                <svg className="mx-auto h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </td>

            </tr>

            {/* Early Access */}

            <tr>

              <td className="px-8 py-6 text-white">
                Early Access to New Features
              </td>

              <td className="text-center">
                <svg className="mx-auto h-7 w-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </td>

              <td className="text-center">
                <svg className="mx-auto h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </td>

            </tr>

            {/* Feedback */}

            <tr>

              <td className="px-8 py-6 text-white">
                Direct Feedback with the Founding Team
              </td>

              <td className="text-center">
                <svg className="mx-auto h-7 w-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </td>

              <td className="text-center">
                <svg className="mx-auto h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </td>

            </tr>

            {/* Performance Partnership */}

            <tr>

              <td className="px-8 py-6 text-white">
                Eligibility for Future Performance-Based Partnership Opportunities
              </td>

              <td className="text-center">
                <svg className="mx-auto h-7 w-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </td>

              <td className="text-center">
                <svg className="mx-auto h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

  </div>

</section>

{/* ================= HOW IT WORKS ================= */}

<section className="bg-slate-950 py-28">

  <div className="mx-auto max-w-7xl px-6">

    <div className="mx-auto max-w-3xl text-center">

      <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
        HOW IT WORKS
      </p>

      <h2 className="text-4xl font-black text-white md:text-6xl">
        Your Journey Starts Here
      </h2>

      <p className="mt-8 text-xl leading-9 text-slate-300">
        Becoming a Founding Creator is straightforward. We&apos;ll help you get your
        storefront ready so you can focus on creating great content and connecting
        with your audience.
      </p>

    </div>

    <div className="mt-24 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

      {/* Step 1 */}

      <div className="relative rounded-3xl border border-slate-800 bg-slate-900 p-10">

        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-2xl font-black text-slate-950">
          1
        </div>

        <h3 className="text-2xl font-bold text-white">
          Apply
        </h3>

        <p className="mt-5 leading-8 text-slate-300">
          Complete a short application so we can learn more about your content,
          audience, and the products you sell.
        </p>

      </div>

      {/* Step 2 */}

      <div className="relative rounded-3xl border border-slate-800 bg-slate-900 p-10">

        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-2xl font-black text-slate-950">
          2
        </div>

        <h3 className="text-2xl font-bold text-white">
          Get Approved
        </h3>

        <p className="mt-5 leading-8 text-slate-300">
          If you&apos;re selected, we&apos;ll invite you into the Founding 25 program and
          begin setting up your creator storefront.
        </p>

      </div>

      {/* Step 3 */}

      <div className="relative rounded-3xl border border-slate-800 bg-slate-900 p-10">

        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-2xl font-black text-slate-950">
          3
        </div>

        <h3 className="text-2xl font-bold text-white">
          Launch
        </h3>

        <p className="mt-5 leading-8 text-slate-300">
          List your first products, announce your auctions to your community,
          and begin building momentum.
        </p>

      </div>

      {/* Step 4 */}

      <div className="relative rounded-3xl border border-slate-800 bg-slate-900 p-10">

        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-2xl font-black text-slate-950">
          4
        </div>

        <h3 className="text-2xl font-bold text-white">
          Grow
        </h3>

        <p className="mt-5 leading-8 text-slate-300">
          Continue growing your audience, hosting auctions, and helping shape the
          future of MrBids as the platform expands.
        </p>

      </div>

    </div>

  </div>

</section>

{/* ================= FAQ ================= */}

<section className="bg-slate-900 py-28">

  <div className="mx-auto max-w-5xl px-6">

    <div className="text-center">

      <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
        FREQUENTLY ASKED QUESTIONS
      </p>

      <h2 className="text-4xl font-black text-white md:text-6xl">
        Questions?
        <br />
        We&apos;ve Got Answers.
      </h2>

      <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">
        Here are some of the most common questions creators ask before joining
        the MrBids Founding 25.
      </p>

    </div>

    <div className="mt-20 space-y-6">

      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <h3 className="text-xl font-bold text-white">
          Do I need a certain number of followers?
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          No. We&apos;re looking for creators with engaged communities and quality
          content—not just large follower counts.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <h3 className="text-xl font-bold text-white">
          Can I continue selling on other platforms?
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          Yes. Joining the Founding 25 does not require exclusivity. You&apos;re free
          to continue using other marketplaces while growing your presence on
          MrBids.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <h3 className="text-xl font-bold text-white">
          What types of products can I sell?
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          MrBids is designed for a wide range of categories, including
          collectibles, electronics, sports cards, Pokémon, sneakers, luxury
          goods, vintage items, estate finds, and more, subject to our seller
          policies.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <h3 className="text-xl font-bold text-white">
          Is there a cost to apply?
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          No. Requesting an invitation to the Founding 25 is free.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <h3 className="text-xl font-bold text-white">
          What happens after I&apos;m selected?
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          We&apos;ll guide you through setting up your branded storefront, help you
          prepare your first auctions, and introduce you to the tools available
          to Founding Creators.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <h3 className="text-xl font-bold text-white">
          How many Founding Creator spots are available?
        </h3>

        <p className="mt-4 leading-8 text-slate-300">
          The program is limited to 25 creators so we can provide a high level
          of support and gather meaningful feedback during the early growth of
          the platform.
        </p>
      </div>

    </div>

  </div>

</section>

{/* ================= FINAL CTA ================= */}

<section
  id="apply"
  className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-32"
>

  {/* Background Glow */}

  <div className="absolute inset-0">

    <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />

  </div>

  <div className="relative mx-auto max-w-4xl px-6">

    <div className="rounded-[36px] border border-emerald-500/20 bg-slate-900/80 p-10 shadow-[0_0_60px_rgba(16,185,129,.12)] backdrop-blur-xl md:p-16">

      <div className="text-center">

        <div className="mb-6 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2">

          <span className="text-sm font-bold uppercase tracking-[0.30em] text-emerald-300">
            Limited to 25 Founding Creators
          </span>

        </div>

        <h2 className="text-4xl font-black text-white md:text-6xl">
          Ready to Build Something Bigger?
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-xl leading-9 text-slate-300">
          If you&apos;re passionate about creating great content, selling unique products,
          and helping shape the future of creator commerce, we&apos;d love to hear from you.
        </p>

      </div>

      {/* FORM */}

      <form className="mt-16 space-y-8">

        <div className="grid gap-6 md:grid-cols-2">

          <input
            type="text"
            placeholder="Full Name"
            className="rounded-2xl border border-slate-700 bg-slate-950 px-6 py-5 text-white outline-none transition focus:border-emerald-400"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="rounded-2xl border border-slate-700 bg-slate-950 px-6 py-5 text-white outline-none transition focus:border-emerald-400"
          />

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <input
            type="text"
            placeholder="Primary Social Profile"
            className="rounded-2xl border border-slate-700 bg-slate-950 px-6 py-5 text-white outline-none transition focus:border-emerald-400"
          />

          <input
            type="text"
            placeholder="What Do You Sell?"
            className="rounded-2xl border border-slate-700 bg-slate-950 px-6 py-5 text-white outline-none transition focus:border-emerald-400"
          />

        </div>

        <textarea
          rows={5}
          placeholder="Tell us a little about yourself and your audience..."
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-6 py-5 text-white outline-none transition focus:border-emerald-400"
        />

        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 px-10 py-5 text-lg font-bold text-white shadow-[0_0_35px_rgba(16,185,129,.45)] transition hover:scale-[1.02]"
        >
          Request My Invitation
        </button>

      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        We&apos;ll review every application personally and contact selected creators
        with next steps.
      </p>

    </div>

  </div>

</section>

{/* ================= FINAL MESSAGE ================= */}

<section className="relative overflow-hidden bg-slate-950 py-32">

  <div className="absolute inset-0">

    <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[180px]" />

  </div>

  <div className="relative mx-auto max-w-5xl px-6 text-center">

    <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-6 py-2">

      <span className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-300">
        MrBids Founding 25
      </span>

    </div>

    <h2 className="mt-10 text-5xl font-black leading-tight text-white md:text-7xl">

      This Isn&apos;t Just Another Marketplace.

      <span className="mt-4 block bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">

        It&apos;s Your Opportunity To Help Build One.

      </span>

    </h2>

    <p className="mx-auto mt-10 max-w-3xl text-xl leading-9 text-slate-300">

      Every marketplace starts with a small group of people who believe in
      something bigger.

      <br /><br />

      We&apos;re looking for creators who want more than another place to sell.

      We&apos;re looking for creators who want to help shape the future of live
      auctions.

    </p>

    <div className="mt-16">

      <a
        href="#apply"
        className="inline-flex rounded-full bg-gradient-to-r from-emerald-500 to-green-400 px-12 py-6 text-xl font-bold text-white shadow-[0_0_45px_rgba(16,185,129,.45)] transition duration-300 hover:scale-105"
      >
        Request Your Invitation
      </a>

    </div>

    <p className="mt-8 text-sm uppercase tracking-[0.30em] text-slate-500">

      Limited to 25 Founding Creators

    </p>

  </div>

            </section>

    </>
  );
}