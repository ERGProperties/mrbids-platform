import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/");
  }

  // 🔥 NEW: Profile completion calculation
  const completion =
    (user.name ? 50 : 0) +
    (user.bio ? 50 : 0);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Edit Profile
      </h1>

      {/* 🔥 NEW: Profile Strength */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-2">
          Profile Strength: {completion}%
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>

        {completion < 100 && (
          <p className="text-xs text-gray-500 mt-2">
            Complete your profile to build trust and increase your chances of winning auctions.
          </p>
        )}
      </div>

      <ProfileForm user={user} />
    </div>
  );
}