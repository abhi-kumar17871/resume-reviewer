import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { User, Users } from "lucide-react";
import StatCard from "@/components/ui/statsCard";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


async function getUserEmail(userId: string): Promise<string> {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error) {
    console.error(`Error fetching user ${userId}:`, error.message);
    return 'Anonymous User';
  }
  return data.user?.email || 'Anonymous User';
}

function anonymizeEmail(email: string): string {
  if (!email.includes('@')) {
    return 'user-****';
  }
  const [localPart, domain] = email.split('@');
  const anonymizedLocalPart = `${localPart.substring(0, 3)}****`;
  return `${anonymizedLocalPart}@${domain}`;
}

export default async function LeaderboardPage() {
  const supabase = getSupabaseServerClient();
  const { data: approvedResumes, error: approvedResumesError } = await supabase
    .from("resumes")
    .select("score, user_id")
    .eq("status", "Approved")
    .order("score", { ascending: false })
    .limit(20);

  const { count: totalParticipants, error: countError } = await supabase
    .from("resumes")
    .select('*', { count: 'exact', head: true });

  if (approvedResumesError || countError) {
    const errorMessage = approvedResumesError?.message || countError?.message;
    return <div className="p-6 text-red-500">Error: {errorMessage}</div>;
  }

  const leaderboardData = await Promise.all(
    (approvedResumes || []).map(async (row) => ({
      ...row,
      email: await getUserEmail(row.user_id),
    }))
  );

  const resumesOnLeaderboard = leaderboardData.length;
  const highestScore = resumesOnLeaderboard > 0 ? leaderboardData[0].score : 0;
  const totalScore = leaderboardData.reduce((sum, row) => sum + (row.score || 0), 0);
  const averageScore = resumesOnLeaderboard > 0 ? (totalScore / resumesOnLeaderboard).toFixed(1) : 0;
  const topPerformers = leaderboardData.filter(row => (row.score || 0) >= 9).length;

  return (
    <div className="bg-gray-50 min-h-svh">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">

        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Top Resume Performers</h1>
          <p className="text-gray-600">
            Discover the highest-scoring resumes from our community. Get inspired by top performers and see how your resume compares.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Participants"
            value={totalParticipants ?? 0}
            description="All submitted resumes"
            icon={<Users size={20} />}
          />
          <StatCard
            title="Highest Score"
            value={highestScore ?? 0}
            description="Best performance"
            icon={<User size={20} />}
          />
          <StatCard
            title="Average Score"
            value={averageScore}
            description="Overall performance"
            icon={<User size={20} />}
          />
          <StatCard
            title="Top Performers"
            value={topPerformers}
            description="Scores 9+"
            icon={<User size={20} />}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-1">Resume Rankings</h2>
          <p className="text-sm text-gray-500 mb-6">
            Top-scoring approved resumes ranked by performance. Names are anonymized for privacy.
          </p>

          {leaderboardData.length > 0 ? (
            <ol className="space-y-3">
              {leaderboardData.map((row, idx) => (
                <li key={`${row.user_id}-${idx}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-500 w-8">{idx + 1}.</span>
                    <span className="font-medium">{anonymizeEmail(row.email)}</span>
                  </div>
                  <span className="font-semibold text-gray-600">{row.score} pts</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No entries yet</p>
              <p className="text-sm text-gray-400 mt-1">The leaderboard will populate as resumes are reviewed and approved.</p>
            </div>
          )}
        </div>

          <div className="text-center bg-gray-50 border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-2">Ready to Join the Leaderboard?</h2>
            <p className="text-gray-600 mb-6">
              Submit your resume for professional review and see how you rank against other candidates.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login" className="bg-gray-400 hover:bg-gray-700 hover:text-white rounded-md px-6 py-2 font-semibold transition-colors">
                Submit Your Resume
              </Link>
            </div>
          </div>
      </div>
    </div>
  );
}