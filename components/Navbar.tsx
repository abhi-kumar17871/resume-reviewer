'use client';

import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { isAdminUser } from '@/lib/auth/admin';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const updateUserStatus = (currentUser: User | null) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        setIsAdmin(isAdminUser(currentUser.email));
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      updateUserStatus(user);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      updateUserStatus(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    router.push('/')
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="pl-8 text-2xl font-bold">ResumeReview</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/leaderboard"
                className="w-28 text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium border-2 border-gray-100 flex items-center justify-center"
              >
                Leaderboard
              </Link>
              
              {/* 4. Conditionally render buttons based on user and admin state */}
              {!loading && (
                user ? (
                  <>
                    {isAdmin ? (
                      <Link
                        href="/admin/resumes"
                        className="w-28 text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium border-2 border-gray-100 flex items-center justify-center"
                      >
                        Submissions
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard"
                        className="w-28 text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium border-2 border-gray-100 flex items-center justify-center"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-28 text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium border-2 border-gray-100 flex items-center justify-center"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="w-28 text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium border-2 border-gray-100 flex items-center justify-center"
                  >
                    Login
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}