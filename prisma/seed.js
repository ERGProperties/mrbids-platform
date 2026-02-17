const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.auction.upsert({
    where: { slug: "2210-mckenzie-ave-waco" },
    update: {},
    create: {
      slug: "2210-mckenzie-ave-waco",
      title: "2210 McKenzie Ave",
      addressLine: "2210 McKenzie Ave",
      cityStateZip: "Waco, TX",

      // REQUIRED IMAGE FIELDS
      imagesPath: "/auctions/2210-mckenzie-ave-waco",
      images: ["01-curbside.jpg"],

      startingBid: 100000,
      bidIncrement: 5000,
      arv: 230000,

      startAt: new Date("2026-02-10T09:00:00-06:00"),
      endAt: new Date("2026-02-15T17:00:00-06:00"),
      status: "CLOSED",

      finalPrice: 155000,
      bidCount: 14,
      durationDays: 5,
    },
  });

  await prisma.auction.upsert({
    where: { slug: "1604-parkdale-dr-wichita-falls" },
    update: {},
    create: {
      slug: "1604-parkdale-dr-wichita-falls",
      title: "1604 Parkdale Dr",
      addressLine: "1604 Parkdale Dr",
      cityStateZip: "Wichita Falls, TX",

      // REQUIRED IMAGE FIELDS
      imagesPath: "/auctions/1604-parkdale-dr-wichita-falls",
      images: ["01-house-front.jpeg"],

      startingBid: 50000,
      bidIncrement: 2500,
      arv: 195000,

      startAt: new Date("2026-02-16T09:00:00-06:00"),
      endAt: new Date("2026-02-21T17:00:00-06:00"),
      status: "LIVE",

      finalPrice: null,
      bidCount: 0,
      durationDays: 5,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
