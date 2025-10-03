import { getSupabaseServerClient } from '@/lib/supabase/server';
import NotificationToggle from '@/components/NotificationToggle';

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const initialIsEnabled = user?.user_metadata?.email_notifications_enabled ?? true;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-gray-600">Manage your account and notification preferences.</p>

      <div className="mt-8 max-w-md rounded-lg border">
        <div className="p-6">
          <h2 className="font-semibold">Email Notifications</h2>
          <p className="mt-1 text-sm text-gray-500">
            Receive an email when a reviewer provides feedback on your resume.
          </p>
        </div>
        <div className="bg-gray-50/50 p-6 border-t">
          <NotificationToggle initialIsEnabled={initialIsEnabled} />
        </div>
      </div>
    </div>
  );
}