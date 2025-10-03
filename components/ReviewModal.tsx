'use client';

import { useEffect, useState } from 'react';
import type { Resume } from '@/lib/types';
import ReviewForm from './ReviewForm';
import { createSignedUrl } from '@/app/actions/resumes';
import { Loader2 } from 'lucide-react';

interface ReviewModalProps {
  resume: Resume;
  onClose: () => void;
  onSave: () => void;
}

export default function ReviewModal({ resume, onClose, onSave }: ReviewModalProps) {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-7xl max-h-[90vh] h-full flex flex-col">
        <h2 className="text-xl font-bold mb-4">Review Resume</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow overflow-y-auto">
          <div className="bg-gray-100 rounded-lg flex items-center justify-center min-h-[400px]">
            {loading && <Loader2 size={32} className="animate-spin text-gray-500" />}
            {error && <p className="text-red-500 px-4 text-center">{error}</p>}
            {pdfUrl && !loading && (
              <embed src={pdfUrl} type="application/pdf" width="100%" height="100%" className="rounded-lg" />
            )}
          </div>
          <div>
            <ReviewForm
              resumeId={resume.id}
              initialStatus={resume.status}
              initialScore={resume.score}
              initialNotes={resume.notes}
              onSave={onSave}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}