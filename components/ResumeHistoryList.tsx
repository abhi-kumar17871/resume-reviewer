'use client';

import { useState } from 'react';
import type { Resume } from '@/lib/types';
import HistoryCard from '@/components/HistoryCard';
import HistoryModal from '@/components/HistoryModal';

export default function ResumeHistoryList({ resumes }: { resumes: Resume[] }) {
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  if (!resumes || resumes.length === 0) {
    return (
      <div className="mt-16 text-center">
        <p className="text-gray-500">No submission history found.</p>
        <p className="text-sm text-gray-400">Upload a resume from your dashboard to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {resumes.map(resume => (
          <HistoryCard key={resume.id} resume={resume} onClick={() => setSelectedResume(resume)} />
        ))}
      </div>

      {selectedResume && (
        <HistoryModal resume={selectedResume} onClose={() => setSelectedResume(null)} />
      )}
    </>
  );
}