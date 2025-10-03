import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";
import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminResumesPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user.email)) {
    return (
      <div className="min-h-svh flex items-center justify-center p-6">
        <div className="text-center">
          <p className="mb-4">Admins only.</p>
          <Link href="/login" className="underline">Go to login</Link>
        </div>
      </div>
    );
  }

  const { data: rows, error } = await supabase
    .from("resumes")
    .select("id, user_id, created_at, status, score")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-6">Error: {error.message}</div>;
  }

  const successMessage = searchParams.success;

  return (
    <div className="min-h-svh p-6 space-y-6">
      <h1 className="text-2xl font-semibold">All Submissions</h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-dark-200 text-blue-50">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Created</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Score</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.id}</td>
              <td className="p-2">{r.user_id}</td>
              <td className="p-2">{new Date(r.created_at as string).toLocaleString()}</td>
              <td className="p-2">{r.status}</td>
              <td className="p-2">{r.score}</td>
              <td className="p-2">
                <Link href={`/admin/review/${r.id}`} className="underline">Review</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


