import { prisma } from "./lib/db"; // ✅ use db.ts (your setup)

async function fixAuctions() {
  const result = await prisma.auction.updateMany({
    where: {
      OR: [
        { endAt: null },
        { endAt: { lt: new Date() } },
      ],
    },
    data: {
      endAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Updated auctions:", result.count);
}

fixAuctions()
  .catch((err) => {
    console.error("❌ Error fixing auctions:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });