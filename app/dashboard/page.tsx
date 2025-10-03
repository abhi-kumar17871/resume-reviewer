export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-svh flex items-center justify-center p-6">
        <div className="text-center">
          <p className="mb-4">You must be logged in to view this page.</p>
          <Link href="/login" className="underline">Go to login</Link>
        </div>
      </div>
    );
  }

  const { data: resume } = await supabase
    .from("resumes")
    .select("id, status, notes, file_path, created_at, score")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let signedUrl: string | null = null;
  if (resume?.file_path) {
    const { data: signed } = await supabase.storage
      .from("resumes")
      .createSignedUrl(resume.file_path, 60 * 5);
    signedUrl = signed?.signedUrl || null;
  }

  return (
    <div className="min-h-svh p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Welcome, {user.email}</p>

      <div className="space-x-3">
        <Link href="/upload" className="underline">Upload Resume</Link>
        <Link href="/leaderboard" className="underline">Leaderboard</Link>
      </div>

      {resume ? (
        <div className="border rounded p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Latest submission</span>
            <span className="px-2 py-1 text-xs rounded bg-gray-100">{resume.status}</span>
            <span className="text-sm">Score: {resume.score}</span>
          </div>
          {resume.notes && (
            <div>
              <div className="text-sm font-medium">Notes</div>
              <p className="text-sm whitespace-pre-wrap">{resume.notes}</p>
            </div>
          )}
          {signedUrl ? (
            <iframe src={signedUrl} className="w-full h-[70vh] border rounded" />
          ) : (
            <p className="text-sm">No preview available.</p>
          )}

          {resume.status === "Needs Revision" && (
            <div>
              <Link href="/upload" className="underline">Upload a revised PDF</Link>
            </div>
          )}
        </div>
      ) : (
        <p>No submissions yet. Start by uploading your resume.</p>
      )}
    </div>
  );
}


