import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";
import Link from "next/link";

export default async function AdminPage() {
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

  return (
    <div className="min-h-svh p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      <p>Use the left nav to find resumes, or go to the review pages.</p>
    </div>
  );
}


