"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";


export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    setSuccess(false);
    const f = acceptedFiles?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }
    setFile(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
  });

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload-resume", { method: "POST", body: form });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Upload failed");
      }
      setSuccess(true);
      setFile(null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "An unknown error occurred";
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-svh p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Upload Resume</h1>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded p-8 text-center ${isDragActive ? "bg-gray-50" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the PDF here ...</p> : <p>Drag &apos;n&apos; drop a PDF here, or click to select</p>}
      </div>
      {file && (
        <div className="space-y-3">
          <p className="text-sm">Selected: {file.name}</p>
          <div className="h-[600px] border rounded">
            <embed src={URL.createObjectURL(file)} type="application/pdf" width="100%" height="100%" />
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-black text-white rounded px-4 py-2"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}
      {success && <p className="text-green-700">Uploaded successfully. Check your dashboard for status.</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}