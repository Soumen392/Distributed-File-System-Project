import Header from "./components/Header";
import DashboardCards from "./components/DashboardCards";
import UploadPanel from "./components/UploadPanel";
import LogsPanel from "./components/LogsPanel";
import FileTable from "./components/FileTable";
import NodesGrid from "./components/NodesGrid";
import SearchPanel from "./components/SearchPanel";
import ChunkDistribution from "./components/ChunkDistribution";

function App() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Header />

        <DashboardCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UploadPanel />
          </div>

          <LogsPanel />
        </div>

        <FileTable />

        <SearchPanel />

        <ChunkDistribution />

        <NodesGrid />
      </div>
    </div>
  );
}

export default App;