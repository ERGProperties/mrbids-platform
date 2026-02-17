const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  /* -------------------------------------------------
     CLOSED AUCTION — 2210 McKenzie Ave, Waco TX
  --------------------------------------------------*/
  await prisma.auction.upsert({
    where: { slug: "2210-mckenzie-ave-waco" },

    update: {
      images: ["01-curbside.jpg"],
    },

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

      images: ["01-curbside.jpg"],

      status: "CLOSED",
      finalPrice: 147500,
      bidCount: 9,
      durationDays: 5,
    },
  });

  /* -------------------------------------------------
     LIVE AUCTION — 1604 Parkdale Dr, Wichita Falls TX
  --------------------------------------------------*/
  await prisma.auction.upsert({
    where: { slug: "1604-parkdale-dr-wichita-falls" },

    update: {
      images: ["01-house-front.jpeg"],
    },

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

      images: ["01-house-front.jpeg"],

      status: "LIVE",
      durationDays: 5,
    },
  });
}

main()
  .then(() => {
    console.log("✅ Auctions seeded (primary image only)");
  })
  .catch((error) => {
    console.error("❌ Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
