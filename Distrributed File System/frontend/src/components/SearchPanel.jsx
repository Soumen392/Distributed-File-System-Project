export default function SearchPanel() {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
      <h2 className="text-2xl font-semibold mb-5">
        Retrieve File
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Enter filename..."
          className="
            flex-1
            bg-slate-900
            border border-slate-700
            rounded-2xl
            px-4
            py-3
            outline-none
            focus:border-blue-500
          "
        />

        <button
          className="
            bg-blue-600
            hover:bg-blue-500
            px-6
            py-3
            rounded-2xl
            transition
            font-medium
          "
        >
          Search File
        </button>
      </div>

      <div className="mt-6 bg-slate-900 rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium">
              test.txt
            </p>

            <p className="text-slate-400 text-sm mt-1">
              8 Chunks • Distributed
            </p>
          </div>

          <button
            className="
              bg-emerald-600
              hover:bg-emerald-500
              px-5
              py-2
              rounded-xl
              transition
            "
          >
            Retrieve
          </button>
        </div>
      </div>
    </div>
  );
}