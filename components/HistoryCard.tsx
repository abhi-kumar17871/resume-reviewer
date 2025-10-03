import type { Resume } from "@/lib/types";
import { Clock, MessageSquareText, Star } from 'lucide-react';

const statusStyles = {
  'Approved': 'bg-green-100 text-green-800',
  'In Review': 'bg-yellow-100 text-yellow-800',
  'Needs Revision': 'bg-yellow-100 text-yellow-800',
  'Rejected': 'bg-red-100 text-red-800',
};

function StatusBadge({ status }: { status: Resume['status'] }) {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export default function HistoryCard({ resume, onClick }: { resume: Resume; onClick: () => void }) {
  return (
    <div 
      onClick={onClick} 
      className="border bg-white rounded-lg p-4 cursor-pointer hover:shadow-lg hover:border-black/20 transition-all duration-200 flex flex-col"
    >
      <div className="flex justify-between items-start">
        <StatusBadge status={resume.status} />
        <div className="flex items-center gap-1 text-sm font-bold">
          <Star size={14} className="text-yellow-500" />
          <span>{resume.score ?? 'N/A'}</span>
        </div>
      </div>
      <div className="mt-4 flex-grow">
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <MessageSquareText size={14} />
            <h3 className="font-semibold">Reviewer Notes</h3>
        </div>
        <p className="mt-1 text-sm text-gray-700 line-clamp-3 h-[60px]">
          {resume.notes || 'No feedback provided yet.'}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t text-xs text-gray-500 flex items-center gap-2">
        <Clock size={12} />
        <span>Submitted on {new Date(resume.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}