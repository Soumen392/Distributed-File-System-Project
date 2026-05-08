import { useState } from "react";

export default function UploadPanel() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setProgress(0);
    }
  }

  function simulateUpload() {
    if (!selectedFile) return;

    let value = 0;

    const interval = setInterval(() => {
      value += 10;

      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);
      }
    }, 300);
  }

  return (
    <div className="
      bg-[#111827]
      border border-slate-800
      rounded-3xl
      p-6
    ">
      <h2 className="text-2xl font-semibold mb-5">
        Upload File
      </h2>

      <label
        className="
          border-2
          border-dashed
          border-slate-700
          hover:border-blue-500
          transition
          rounded-3xl
          p-14
          text-center
          bg-slate-950/40
          cursor-pointer
          block
        "
      >
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="space-y-3">
          <div className="text-6xl">📁</div>

          <p className="text-2xl font-medium">
            Click To Select File
          </p>

          <p className="text-slate-400">
            Upload files for chunking and distribution
          </p>

          {selectedFile && (
            <div className="
              mt-6
              bg-slate-900
              border border-slate-700
              rounded-2xl
              p-4
              text-left
            ">
              <p className="font-medium text-lg">
                {selectedFile.name}
              </p>

              <p className="text-slate-400 text-sm mt-1">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>

              <div className="mt-4">
                <div className="
                  w-full
                  h-3
                  bg-slate-800
                  rounded-full
                  overflow-hidden
                ">
                  <div
                    className="
                      h-full
                      bg-blue-500
                      transition-all
                      duration-300
                    "
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <p className="text-sm text-slate-400 mt-2">
                  Upload Progress: {progress}%
                </p>
              </div>
            </div>
          )}
        </div>
      </label>

      <button
        onClick={simulateUpload}
        className="
          mt-5
          w-full
          bg-blue-600
          hover:bg-blue-500
          py-3
          rounded-2xl
          transition
          font-medium
        "
      >
        Upload To Distributed Network
      </button>
    </div>
  );
}