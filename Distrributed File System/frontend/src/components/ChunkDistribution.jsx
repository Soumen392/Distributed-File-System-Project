const chunks = [
  {
    id: 0,
    users: ["user1", "user2"],
  },
  {
    id: 1,
    users: ["user2", "user3"],
  },
  {
    id: 2,
    users: ["user3", "user4"],
  },
  {
    id: 3,
    users: ["user4", "user5"],
  },
  {
    id: 4,
    users: ["user1", "user5"],
  },
];

export default function ChunkDistribution() {
  return (
    <div className="
      bg-[#111827]
      border border-slate-800
      rounded-3xl
      p-6
    ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Chunk Distribution
        </h2>

        <span className="
          bg-blue-500/20
          text-blue-400
          px-4
          py-2
          rounded-xl
          text-sm
        ">
          Replication Enabled
        </span>
      </div>

      <div className="space-y-4">
        {chunks.map((chunk) => (
          <div
            key={chunk.id}
            className="
              bg-slate-900
              border border-slate-800
              rounded-2xl
              p-5
            "
          >
            <div className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
            ">
              <div>
                <p className="text-lg font-medium">
                  Chunk {chunk.id}
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  Replicated Across Nodes
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {chunk.users.map((user, index) => (
                  <div
                    key={index}
                    className="
                      bg-blue-600/20
                      border border-blue-500/30
                      text-blue-300
                      px-4
                      py-2
                      rounded-xl
                      text-sm
                    "
                  >
                    {user}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}