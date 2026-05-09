const files = [
  {
    name: "test.txt",
    chunks: 8,
    size: "32 KB",
    status: "Distributed",
  },
];

export default function FileTable() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <h2 className="text-2xl font-semibold mb-5">
        Shared Files
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="text-left py-3">File</th>
              <th className="text-left py-3">Chunks</th>
              <th className="text-left py-3">Size</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {files.map((file, index) => (
              <tr
                key={index}
                className="border-b border-slate-800"
              >
                <td className="py-4">{file.name}</td>
                <td>{file.chunks}</td>
                <td>{file.size}</td>
                <td>
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-xl text-sm">
                    {file.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}