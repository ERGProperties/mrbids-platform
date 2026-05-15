import Link from "next/link";

const categories = [
  {
    title: "Jewelry",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop",
    description:
      "Luxury watches, chains, rings, diamonds, and rare jewelry auctions.",
  },
  {
    title: "Electronics",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    description:
      "Phones, laptops, gaming systems, cameras, and tech liquidation deals.",
  },
  {
    title: "Sneakers",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    description:
      "Rare sneaker drops, collectibles, and high-demand footwear auctions.",
  },
  {
    title: "Collectibles",
    image:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop",
    description:
      "Trading cards, memorabilia, antiques, and rare collectible finds.",
  },
  {
    title: "Liquidation",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop",
    description:
      "Bulk inventory, pallets, closeouts, and liquidation merchandise.",
  },
  {
    title: "Luxury Items",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
    description:
      "Designer goods, premium accessories, luxury fashion, and rare pieces.",
  },
  {
    title: "Storage Finds",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
    description:
      "Unexpected treasures and storage-unit style auction discoveries.",
  },
  {
    title: "Real Estate",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
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
                href={category.href || "/live"}
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