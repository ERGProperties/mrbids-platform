import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    redirect("/signin");
  }

  // Already completed onboarding
  if (
    user.username &&
    user.name &&
    user.sellerBio &&
    user.sellerCategory
  ) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to MrBids
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Create your storefront in under a minute.
          </p>

          <p className="mt-2 text-gray-500">
            Your storefront is where buyers discover you, follow you,
            and browse everything you sell.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
          <OnboardingWizard />
        </div>
      </div>
    </main>
  );
}