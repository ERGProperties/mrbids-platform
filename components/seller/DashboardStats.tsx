type Props = {
  activeAuctions: number;
  endingToday: number;
  completedAuctions: number;
  totalBids: number;
};

const stats = [
  {
    label: "Active Auctions",
    color: "text-green-600",
    key: "activeAuctions",
  },
  {
    label: "Ending Today",
    color: "text-red-600",
    key: "endingToday",
  },
  {
    label: "Completed",
    color: "text-blue-600",
    key: "completedAuctions",
  },
  {
    label: "Total Bids",
    color: "text-purple-600",
    key: "totalBids",
  },
] as const;

export default function DashboardStats({
  activeAuctions,
  endingToday,
  completedAuctions,
  totalBids,
}: Props) {
  const values = {
    activeAuctions,
    endingToday,
    completedAuctions,
    totalBids,
  };

  return (
    <section className="mt-12">

      <h2 className="text-2xl font-semibold mb-6">
        Overview
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((stat) => (

          <div
            key={stat.key}
            className="rounded-3xl border bg-white p-8 shadow-sm"
          >

            <p className="text-sm text-gray-500">
              {stat.label}
            </p>

            <p
              className={`mt-4 text-4xl font-bold ${stat.color}`}
            >
              {values[stat.key]}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}