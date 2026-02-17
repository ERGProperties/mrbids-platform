import { prisma } from "../lib/db";

async function main() {
  // Closed auction (McKenzie)
  await prisma.auction.upsert({
    where: { slug: "2210-mckenzie-ave-waco" },
    update: {},
    create: {
      slug: "2210-mckenzie-ave-waco",
      title: "2210 McKenzie Ave",
      addressLine: "2210 McKenzie Ave",
      cityStateZip: "Waco, TX 76708",

      startAt: new Date("2026-02-10T12:00:00-06:00"),
      endAt: new Date("2026-02-15T17:00:00-06:00"),

      startingBid: 100000,
      bidIncrement: 5000,
      arv: 230000,

      status: "CLOSED",
      finalPrice: 147500,
      bidCount: 9,
      durationDays: 5,
    },
  });

  // Live auction (Parkdale)
  await prisma.auction.upsert({
    where: { slug: "1604-parkdale-dr-wichita-falls" },
    update: {},
    create: {
      slug: "1604-parkdale-dr-wichita-falls",
      title: "1604 Parkdale Dr",
      addressLine: "1604 Parkdale Dr",
      cityStateZip: "Wichita Falls, TX",

      startAt: new Date("2026-02-16T12:00:00-06:00"),
      endAt: new Date("2026-02-21T17:00:00-06:00"),

      startingBid: 50000,
      bidIncrement: 2500,
      arv: 195000,

      status: "LIVE",
      durationDays: 5,
    },
  });
}

main()
  .then(() => {
    console.log("✅ Auctions seeded");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
