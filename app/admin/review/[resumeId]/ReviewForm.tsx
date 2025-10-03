'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  resumeId: string;
  initialStatus: string;
  initialScore: number | null;
  initialNotes: string | null;
}

export default function ReviewForm({ resumeId, initialStatus, initialScore, initialNotes }: ReviewFormProps) {
  const [status, setStatus] = useState(initialStatus);
  const [score, setScore] = useState(initialScore ? initialScore.toString() : '');
  const [notes, setNotes] = useState(initialNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/resumes/${resumeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status, 
          score, 
          notes 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update review');
      }

      // Redirect to admin resumes page with success message
      router.push('/admin/resumes?success=Review updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm mb-1">Status</label>
        <select 
          name="status" 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-2 py-1"
          disabled={isSubmitting}
        >
          <option value="Approved">Approved</option>
          <option value="Needs Revision">Needs Revision</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm mb-1">Score</label>
        <input 
          type="number" 
          name="score" 
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="border rounded px-2 py-1" 
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label className="block text-sm mb-1">Notes</label>
        <textarea 
          name="notes" 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border rounded px-2 py-1 w-full" 
          rows={4}
          disabled={isSubmitting}
        />
      </div>
      
      <button 
        type="submit" 
        className="bg-black text-white rounded px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
