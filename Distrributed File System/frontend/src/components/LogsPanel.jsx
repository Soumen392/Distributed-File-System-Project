const logs = [
  "Server listening on port 5000",
  "Chunk 0 distributed to user1",
  "Chunk 1 distributed to user2",
  "Client requested test.txt",
  "Merge successful",
];

export default function LogsPanel() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <h2 className="text-2xl font-semibold mb-5">
        System Logs
      </h2>

      <div className="space-y-3 max-h-[450px] overflow-y-auto">
        {logs.map((log, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-xl p-3 text-sm"
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}