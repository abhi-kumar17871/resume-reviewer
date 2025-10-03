'use client';

import { useState } from 'react';
import UploadModal from './UploadModal';

export default function DashboardUploadButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-black text-white rounded-md px-6 py-2 font-semibold hover:bg-gray-800 transition-colors"
      >
        Upload Resume
      </button>
      {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}