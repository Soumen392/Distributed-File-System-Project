const cards = [
  {
    title: "Files",
    value: "12",
  },
  {
    title: "Chunks",
    value: "84",
  },
  {
    title: "Nodes",
    value: "5",
  },
  {
    title: "Encryption",
    value: "AES-256",
  },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="
            bg-slate-900/70
            backdrop-blur-lg
            border border-slate-800
            rounded-3xl
            p-6
            hover:border-blue-500
            transition-all
            duration-300
            hover:scale-105
          "
        >
          <p className="text-slate-400">
            {card.title}
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}