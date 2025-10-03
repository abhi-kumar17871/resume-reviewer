'use client';

import { useState } from 'react';
import UploadModal from './UploadModal';

export default function DashboardUploadButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-gray-300 hover:bg-gray-700 hover:text-white h-12 px-8 font-bold rounded-md flex justify-center items-center"
      >
        Upload Resume
      </button>
      {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}