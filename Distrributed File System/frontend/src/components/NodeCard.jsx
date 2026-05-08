export default function NodeCard({ user }) {
  return (
    <div className="
      bg-slate-800/70
      backdrop-blur-lg
      border border-slate-700
      rounded-3xl
      p-5
      transition-all
      duration-300
      hover:border-blue-500
      hover:scale-105
      hover:shadow-2xl
      hover:shadow-blue-500/10
    ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">
          {user.name}
        </h3>

        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
      </div>

      <p className="text-slate-400 text-sm mb-3">
        Stored Chunks
      </p>

      <div className="flex flex-wrap gap-2">
        {user.chunks.length > 0 ? (
          user.chunks.map((chunk, index) => (
            <span
              key={index}
              className="
                bg-blue-600/20
                border border-blue-500/30
                text-blue-300
                px-3
                py-1
                rounded-lg
                text-sm
              "
            >
              Chunk {chunk}
            </span>
          ))
        ) : (
          <span className="text-slate-500 text-sm">
            No chunks stored
          </span>
        )}
      </div>
    </div>
  );
}