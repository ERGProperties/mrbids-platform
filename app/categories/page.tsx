import Link from "next/link";

const categories = [
  {
    title: "Jewelry",
    description: "Luxury pieces, watches, chains, rings, and rare finds.",
  },
  {
    title: "Electronics",
    description: "Phones, gaming systems, computers, and trending tech.",
  },
  {
    title: "Collectibles",
    description: "Sports cards, memorabilia, rare collectibles, and vintage items.",
  },
  {
    title: "Liquidation",
    description: "Bulk inventory, overstock, shelf pulls, and wholesale deals.",
  },
  {
    title: "Real Estate",
    description: "Investment properties, distressed homes, and off-market opportunities.",
  },
  {
    title: "Sneakers",
    description: "Rare releases, hype sneakers, and collectible footwear.",
  },
  {
    title: "Luxury Items",
    description: "Designer goods, premium accessories, and exclusive inventory.",
  },
  {
    title: "Storage Finds",
    description: "Unique items and hidden treasures sourced from storage auctions.",
  },
];

export default function CategoriesPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-36 pb-24">

        <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-6">
          Auction Categories
        </p>

        <h1 className="text-6xl md:text-7xl font-semibold leading-[1.05]">
          Browse Categories
        </h1>

        <p className="mt-10 text-xl text-gray-600 max-w-2xl">
          Explore LIVE auctions across multiple categories including
          collectibles, electronics, jewelry, liquidation, and real estate.
        </p>

      </section>

      {/* CATEGORY GRID */}
      <section className="border-t">

        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {categories.map((category) => (

              <div
                key={category.title}
                className="border rounded-3xl p-10 hover:shadow-lg transition"
              >

                <h2 className="text-2xl font-semibold">
                  {category.title}
                </h2>

                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  {category.description}
                </p>

                <Link
                  href={
                    category.title === "Real Estate"
                      ? "/real-estate"
                      : "/live"
                  }
                  className="inline-block mt-8 text-sm font-medium"
                >
                  Explore →
                </Link>

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}