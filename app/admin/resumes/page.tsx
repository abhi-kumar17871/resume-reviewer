'use client';

import { useEffect, useState } from 'react';
import ReviewModal from '@/components/ReviewModal';
import type { Resume } from '@/lib/types';
import { getResumesWithEmails } from '@/app/actions/admin';

export default function AdminResumesPage() {
  const [resumes, setResumes] = useState<(Resume & { email: string })[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchResumes = async () => {
    const { resumes: fetchedResumes, error: fetchError } = await getResumesWithEmails();
    if (fetchError) {
      setError(fetchError);
    } else if (fetchedResumes) {
      setResumes(fetchedResumes);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleReviewClick = (resume: Resume) => {
    setSelectedResume(resume);
  };

  const handleCloseModal = () => {
    setSelectedResume(null);
  };

  const handleReviewSave = () => {
    fetchResumes();
    setSelectedResume(null);
  };

  if (error) {
    return <div className="p-6">Error: {error}</div>;
  }

  return (
    <div className="min-h-svh p-6 space-y-6">
      <h1 className="text-2xl font-semibold">All Submissions</h1>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-dark-200">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Created</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Score</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {resumes?.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.id}</td>
              <td className="p-2">{r.email}</td>
              <td className="p-2">
                {new Date(r.created_at as string).toLocaleString()}
              </td>
              <td className="p-2">{r.status}</td>
              <td className="p-2">{r.score}</td>
              <td className="p-2">
                <button onClick={() => handleReviewClick(r)} className="underline">
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedResume && (
        <ReviewModal
          resume={selectedResume}
          onClose={handleCloseModal}
          onSave={handleReviewSave}
        />
      )}
    </div>
  );
}