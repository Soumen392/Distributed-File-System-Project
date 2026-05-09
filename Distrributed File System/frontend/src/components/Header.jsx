export default function Header() {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-4xl font-bold">
          Distributed File Storage System
        </h1>

        <p className="text-slate-400 mt-2">
          Secure Chunk-Based Distributed Storage
        </p>
      </div>

      <div className="flex gap-3">
        <button className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-2xl transition">
          Upload File
        </button>

        <button className="bg-emerald-600 hover:bg-emerald-500 px-5 py-3 rounded-2xl transition">
          Merge File
        </button>
      </div>
    </div>
  );
}