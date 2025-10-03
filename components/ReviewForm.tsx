'use client';

import { useState } from 'react';

interface ReviewFormProps {
    resumeId: string;
    initialStatus: string;
    initialScore: number | null;
    initialNotes: string | null;
    onSave: () => void;
    onClose: () => void;
}

export default function ReviewForm({ resumeId, initialStatus, initialScore, initialNotes, onSave, onClose }: ReviewFormProps) {
    const [status, setStatus] = useState(initialStatus === 'In Review' ? '' : initialStatus);
    const [score, setScore] = useState(initialScore ? initialScore.toString() : '');
    const [notes, setNotes] = useState(initialNotes || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!status) {
            setStatus("Approved");
            return;
        }

        setIsSubmitting(true);

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

            onSave();
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
                    defaultValue={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="border rounded px-2 py-1"
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label className="block text-sm mb-1">Notes</label>
                <textarea
                    name="notes"
                    defaultValue={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    rows={4}
                    disabled={isSubmitting}
                />
            </div>
            <div className='flex justify-start gap-4 '>
            <button
                type="submit"
                className="w-24 bg-gray-300 hover:bg-gray-700 hover:text-white h-12 px-8 font-bold rounded-md flex justify-center items-center"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="w-24 border-gray-600 rounded-md border-2 h-12 px-8 bg-transparent flex justify-center items-center hover:bg-gray-200">
                Close
            </button>
            </div>
        </form>
    );
}