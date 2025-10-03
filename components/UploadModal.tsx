'use client';

import { useCallback, useState } from "react";
import { useRouter } from 'next/navigation';
import { UploadCloud, Loader2, X } from 'lucide-react';
import { useDropzone } from "react-dropzone";

export default function UploadModal({ onClose }: { onClose: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null);
        const f = acceptedFiles?.[0];
        if (!f) return;

        if (f.type !== "application/pdf") {
            setError("Please upload a PDF file");
            setFile(null);
            setPreviewUrl(null);
            return;
        }

        setFile(f);
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "application/pdf": [".pdf"] },
        onDragEnter: () => console.log('Drag entered the dropzone.'),
        onDragLeave: () => console.log('Drag left the dropzone.'),
    });

    const handleUpload = async () => {
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

            setTimeout(() => {
                router.refresh();
                onClose();
            }, 1000);

        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "An unknown error occurred";
            setError(message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onDragOver={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
            onDrop={(e) => {
                if (e.target === e.currentTarget) e.preventDefault();
            }}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Upload Your Resume</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    {!file ? (
                        <div
                            {...getRootProps()}
                            className={`w-full h-60 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <UploadCloud size={48} className={`transition-colors ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                            <p className={`mt-2 text-sm ${isDragActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                {isDragActive ? 'Yes, right here!' : <span className="font-semibold">Click to upload or drag and drop</span>}
                            </p>
                            <p className="text-xs text-gray-500">PDF only</p>
                        </div>

                    ) : (
                        <div>
                            <p className="mb-2 text-sm font-medium">Preview:</p>
                            <embed src={previewUrl!} type="application/pdf" width="100%" height="400px" className="border rounded-md" />
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <div className="p-4 border-t mt-auto flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {uploading && <Loader2 size={16} className="animate-spin" />}
                        {uploading ? 'Uploading...' : 'Upload Resume'}
                    </button>
                </div>
            </div>
        </div>
    );
}