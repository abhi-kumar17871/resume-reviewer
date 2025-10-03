"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/auth/admin";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setIsAdmin(isAdminUser(user.email));
      }
      setLoading(false);
    };

    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    router.refresh();
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Resume Review Platform</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Upload your resume and get quick, actionable feedback. Track top performers on the leaderboard and manage your reviews from the dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {user ? (
            // --- User IS Logged In ---
            <>
              {isAdmin ? (
                // --- ADMIN View ---
                <>
                  <Link
                    href="/admin/resumes"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-5 py-3 text-sm font-medium transition-colors hover:bg-blue-700"
                  >
                    All Submissions
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/20 px-5 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    View Leaderboard
                  </Link>
                  <button onClick={handleLogout} className="inline-flex items-center justify-center rounded-md bg-red-500 text-white px-5 py-3 text-sm font-medium transition-colors hover:bg-red-600">
                    Log out
                  </button>
                </>
              ) : (
                // --- REGULAR USER View ---
                <>
                  <Link
                    href="/upload"
                    className="inline-flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black px-5 py-3 text-sm font-medium transition-colors hover:opacity-90"
                  >
                    Upload Resume
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/20 px-5 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    Open Dashboard
                  </Link>
                   <Link
                    href="/leaderboard"
                    className="inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/20 px-5 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    View Leaderboard
                  </Link>
                  <button onClick={handleLogout} className="inline-flex items-center justify-center rounded-md bg-red-500 text-white px-5 py-3 text-sm font-medium transition-colors hover:bg-red-600">
                    Log out
                  </button>
                </>
              )}
            </>
          ) : (
            // --- User IS NOT Logged In ---
            <>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black px-5 py-3 text-sm font-medium transition-colors hover:opacity-90"
              >
                Upload Resume
              </Link>
              <Link
                href="/leaderboard"
                className="inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/20 px-5 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                View Leaderboard
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/20 px-5 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/20 px-5 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                Admin
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}