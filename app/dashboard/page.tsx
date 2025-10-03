export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getSupabaseServerClient } from "@/lib/supabase/server";
import DashboardUploadButton from "@/components/DashboardUploadButton";

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

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
      .createSignedUrl(resume.file_path, 60 * 5); // 5 minute URL
    signedUrl = signed?.signedUrl || null;
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, <span className="font-medium">{user.email}</span></p>
        </div>
        {resume && <DashboardUploadButton />}
      </div>

      <div className="rounded-lg space-y-4">
        {resume ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="font-semibold text-lg">Latest Submission</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span>Status:</span>
                <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                  resume.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  resume.status === 'Needs Revision' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>{resume.status}</span>
              </div>
              <div>Score: <span className="font-bold">{resume.score ?? 'N/A'}</span></div>
              {resume.notes && (
                <div>
                  <div className="font-medium ">Reviewer Notes: <span className="whitespace-pre-wrap mt-1">"{resume.notes}"</span></div>
                </div>
              )}
              <div>Submitted on: <span className="font-bold">{new Date(resume.created_at).toLocaleString()}</span></div>
            </div>
            <div className="max-w-6xl flex items-center justify-center">
              {signedUrl ? (
                <embed src={signedUrl} type="application/pdf" width="100%" height="400px" className="border rounded-md" />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">No preview available.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="mb-4">No submissions yet. Start by uploading your resume.</p>
            <DashboardUploadButton />
          </div>
        )}
      </div>
    </div>
  );
}