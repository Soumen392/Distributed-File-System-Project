import NodeCard from "./NodeCard";

const users = [
  { name: "user1", chunks: [0, 4, 5] },
  { name: "user2", chunks: [1, 6] },
  { name: "user3", chunks: [2, 7] },
  { name: "user4", chunks: [3] },
  { name: "user5", chunks: [] },
];

export default function NodesGrid() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Distributed Storage Nodes
        </h2>

        <span className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm">
          Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {users.map((user, index) => (
          <NodeCard key={index} user={user} />
        ))}
      </div>
    </div>
  );
}