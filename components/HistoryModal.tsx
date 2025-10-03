'use client';

import { useEffect, useState } from 'react';
import type { Resume } from '@/lib/types';
import { createSignedUrl } from '@/app/actions/resumes';
import { X, Loader2, Star, Calendar, MessageSquareText } from 'lucide-react';

const statusStyles = {
  'Approved': 'bg-green-100 text-green-800',
  'In Review': 'bg-yellow-100 text-yellow-800',
  'Needs Revision': 'bg-yellow-100 text-yellow-800',
  'Rejected': 'bg-red-100 text-red-800',
};

export default function HistoryModal({ resume, onClose }: { resume: Resume; onClose: () => void }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resume.file_path) {
      setLoading(true);
      setError(null);
      createSignedUrl(resume.file_path)
        .then(result => {
          if ('signedUrl' in result) {
            setPdfUrl(result.signedUrl);
          } else {
            setError(result.error);
          }
        })
        .catch(() => setError("An unexpected error occurred."))
        .finally(() => setLoading(false));
    }
  }, [resume.file_path]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Submission Details</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          {/* Left Column: Details */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[resume.status]}`}>
                {resume.status}
              </span>
            </div>
             <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><Star size={16}/> Score</h3>
              <p className="text-2xl font-bold">{resume.score ?? 'Not Scored'}</p>
            </div>
             <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><Calendar size={16}/> Submitted</h3>
              <p className="text-sm text-gray-600">{new Date(resume.created_at).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><MessageSquareText size={16}/> Reviewer Notes</h3>
              <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md whitespace-pre-wrap h-48 overflow-y-auto">
                {resume.notes || 'No feedback provided.'}
              </p>
            </div>
          </div>

          {/* Right Column: PDF Preview */}
          <div className="lg:col-span-2 bg-gray-100 rounded-lg flex items-center justify-center min-h-[400px]">
            {loading && <Loader2 size={32} className="animate-spin text-gray-500" />}
            {error && <p className="text-red-500 px-4 text-center">{error}</p>}
            {pdfUrl && !loading && (
              <embed src={pdfUrl} type="application/pdf" width="100%" height="100%" className="rounded-lg" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}