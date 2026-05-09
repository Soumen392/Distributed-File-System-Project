export default function Header() {
  return (
    <div className="
      bg-slate-900/70
      backdrop-blur-lg
      border border-slate-800
      rounded-3xl
      p-8
      flex
      flex-col
      lg:flex-row
      lg:items-center
      lg:justify-between
      gap-6
    ">
      <div>
        <h1 className="text-4xl font-bold leading-tight">
          Distributed File Storage System
        </h1>

        <p className="text-slate-400 mt-3 text-lg">
          Secure Chunk-Based Distributed Storage
          with Replication and Fault Tolerance
        </p>
      </div>

      <div className="
        flex
        flex-wrap
        gap-4
      ">
        <div className="
          bg-blue-500/10
          border border-blue-500/20
          px-5
          py-3
          rounded-2xl
        ">
          <p className="text-sm text-slate-400">
            Encryption
          </p>

          <p className="text-blue-400 font-semibold mt-1">
            AES-256
          </p>
        </div>

        <div className="
          bg-emerald-500/10
          border border-emerald-500/20
          px-5
          py-3
          rounded-2xl
        ">
          <p className="text-sm text-slate-400">
            Replication
          </p>

          <p className="text-emerald-400 font-semibold mt-1">
            Enabled
          </p>
        </div>

        <div className="
          bg-purple-500/10
          border border-purple-500/20
          px-5
          py-3
          rounded-2xl
        ">
          <p className="text-sm text-slate-400">
            Storage Nodes
          </p>

          <p className="text-purple-400 font-semibold mt-1">
            5 Active
          </p>
        </div>
      </div>
    </div>
  );
}