import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";
import Link from "next/link";
import ReviewForm from "./ReviewForm";
import { createClient } from "@supabase/supabase-js";

type PageProps = {
  params: Promise<{ resumeId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ReviewPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

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

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: resume, error } = await supabaseAdmin
    .from("resumes")
    .select("id, user_id, file_path, status, score, notes")
    .eq("id", params.resumeId)
    .maybeSingle();

  if (error) { return <div className="p-6">Error: {error.message}</div>; }
  if (!resume) { return <div className="p-6">Not found</div>; }

  const { data: signed } = await supabaseAdmin.storage
    .from("resumes")
    .createSignedUrl(resume.file_path as string, 60 * 10);

  const errorMessage = searchParams.error;
  const successMessage = searchParams.success;

  return (
    <div className="min-h-svh p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Review Resume {resume.id}</h1>
      
      {errorMessage && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errorMessage as string}</div> )}
      {successMessage && ( <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{successMessage as string}</div> )}

      {signed?.signedUrl ? (
        // --- Using a robust <object> tag for PDF embedding ---
        <object 
          data={signed.signedUrl} 
          type="application/pdf" 
          width="100%" 
          height="800px"
          className="border rounded"
        >
          <p>
            Your browser does not support PDF previews. You can 
            <a href={signed.signedUrl} download> download the PDF</a> instead.
          </p>
        </object>
      ) : (
        <p>Preview unavailable. The file link could not be generated.</p>
      )}

      <ReviewForm 
        resumeId={resume.id}
        initialStatus={resume.status as string}
        initialScore={resume.score as number}
        initialNotes={resume.notes as string}
      />
    </div>
  );
}