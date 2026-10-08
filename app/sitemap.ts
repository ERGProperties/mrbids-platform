import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mrbids.com";

  /*
   * Permanent public pages
   */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/live`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/auctions`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/marketplace-auctions`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/real-estate`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/collectors`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/founding-25`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/join`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/buyer-faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sell-property`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/disclosures`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/seller-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  /*
   * Public real-estate auctions
   */
  const realEstateAuctions = await prisma.auction.findMany({
    where: {
      slug: {
        not: null,
      },
      status: {
        not: "DRAFT",
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const realEstateUrls: MetadataRoute.Sitemap =
    realEstateAuctions
      .filter((auction) => auction.slug)
      .map((auction) => ({
        url: `${baseUrl}/auctions/${auction.slug}`,
        lastModified: auction.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.8,
      }));

  /*
   * Public marketplace auctions
   */
  const marketplaceAuctions =
    await prisma.marketplaceAuction.findMany({
      where: {
        status: {
          not: "DRAFT",
        },
      },
      select: {
        id: true,
        updatedAt: true,
      },
    });

  const marketplaceUrls: MetadataRoute.Sitemap =
    marketplaceAuctions.map((auction) => ({
      url: `${baseUrl}/marketplace-auctions/${auction.id}`,
      lastModified: auction.updatedAt,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    }));

  return [
    ...staticPages,
    ...realEstateUrls,
    ...marketplaceUrls,
  ];
}