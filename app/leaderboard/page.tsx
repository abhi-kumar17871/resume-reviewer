import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUserEmail(userId: string): Promise<string> {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return 'Anonymous User';
  }
  return data.user?.email || 'Anonymous User';
}

export default async function LeaderboardPage() {
  const supabase = getSupabaseServerClient();
  const { data: resumes, error } = await supabase
    .from("resumes")
    .select("score, user_id")
    .eq("status", "Approved")
    .order("score", { ascending: false })
    .limit(20);

  if (error) {
    return <div className="p-6">Error: {error.message}</div>;
  }

  const leaderboardData = await Promise.all(
    resumes.map(async (row) => ({
      ...row,
      email: await getUserEmail(row.user_id),
    }))
  );

  return (
    <div className="min-h-svh p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Leaderboard</h1>
      <ol className="space-y-2 list-decimal list-inside">
        {leaderboardData.map((row, idx) => (
          <li key={`${row.user_id}-${idx}`}>
            <span className="font-medium">{row.email}</span> – score {row.score}
          </li>
        ))}
      </ol>
    </div>
  );
}