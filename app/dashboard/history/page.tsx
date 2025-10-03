import { getSupabaseServerClient } from "@/lib/supabase/server";
import ResumeHistoryList from "@/components/ResumeHistoryList";
import type { Resume } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ResumeHistoryPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="p-8">Please log in to see your history.</p>;
  }

  // Fetch all resumes for the current user, ordered by most recent
  const { data: resumes, error } = await supabase
    .from("resumes")
    .select("id, status, notes, file_path, created_at, score")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="p-8 text-red-500">Could not fetch resume history.</p>;
  }
  
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold">Resume History</h1>
      <p className="mt-2 text-gray-600">Review your past resume submissions and feedback.</p>
      {/* We pass the server-fetched data to a client component for interactivity */}
      <ResumeHistoryList resumes={resumes as Resume[]} />
    </div>
  );
}