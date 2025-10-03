'use client';

import { useState, useTransition } from 'react';
import { updateNotificationSetting } from '@/app/actions/settings';
import { Loader2 } from 'lucide-react';

export default function NotificationToggle({ initialIsEnabled }: { initialIsEnabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(initialIsEnabled);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newIsEnabled = !isEnabled;
    // Optimistically update the UI
    setIsEnabled(newIsEnabled);

    // Call the server action in the background
    startTransition(() => {
      updateNotificationSetting(newIsEnabled)
        .then((result) => {
          if (result?.error) {
            // If the server action fails, revert the UI state
            setIsEnabled(!newIsEnabled);
            // Optionally, show an error message to the user
            alert(result.error);
          }
        });
    });
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">Email me when my resume is reviewed</span>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50
          ${isEnabled ? 'bg-black' : 'bg-gray-200'}`}
      >
        <span
          className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}
        >
          {isPending && (
            <Loader2 size={16} className="absolute inset-0 m-auto animate-spin text-gray-500" />
          )}
        </span>
      </button>
    </div>
  );
}