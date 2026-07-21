import Link from "next/link";

const categories = [
  {
    title: "Jewelry",
    slug: "jewelry",
    image: "/images/categories/jewelry.png",
    description:
      "Luxury watches, chains, rings, diamonds, and rare jewelry auctions.",
  },
  {
    title: "Electronics",
    slug: "electronics",
    image: "/images/categories/electronics.png",
    description:
      "Phones, laptops, gaming systems, cameras, and tech liquidation deals.",
  },
  {
    title: "Sneakers",
    slug: "sneakers",
    image: "/images/categories/sneakers.png",
    description:
      "Rare sneaker drops, collectibles, and high-demand footwear auctions.",
  },
  {
    title: "Collectibles",
    slug: "collectibles",
    image: "/images/categories/collectibles.png",
    description:
      "Trading cards, memorabilia, antiques, and rare collectible finds.",
    href: "/collectors",
  },
  {
    title: "Liquidation",
    slug: "liquidation",
    image: "/images/categories/liquidation.png",
    description:
      "Bulk inventory, pallets, closeouts, and liquidation merchandise.",
  },
  {
    title: "Luxury Items",
    slug: "luxury-items",
    image: "/images/categories/luxury-items.png",
    description:
      "Designer goods, premium accessories, luxury fashion, and rare pieces.",
  },
  {
    title: "Storage Finds",
    slug: "storage-finds",
    image: "/images/categories/storage-finds.png",
    description:
      "Unexpected treasures and storage-unit style auction discoveries.",
  },
  {
    title: "Real Estate",
    slug: "real-estate",
    image: "/images/categories/real-estate.png",
    description:
      "Investment properties, distressed homes, and seller-direct auctions.",
    href: "/real-estate",
  },
];

export default function CategoriesPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-6">
            Marketplace Categories
          </p>

          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.02]">
            Browse Categories
          </h1>

          <p className="mt-8 text-xl text-gray-600">
            Explore LIVE marketplace auctions across multiple product
            categories and seller verticals.
          </p>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={
                  category.href ??
                  `/marketplace-auctions?category=${category.slug}`
                }
                className="group border rounded-3xl overflow-hidden hover:shadow-2xl transition bg-white"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-black/25" />

                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-black">
                      CATEGORY
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <h2 className="text-2xl font-semibold">
                    {category.title}
                  </h2>

                  <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="mt-6 text-sm font-medium">
                    Explore →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}