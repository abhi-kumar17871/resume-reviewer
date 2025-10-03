"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const origin = window.location.origin;
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    if (err) setError(err.message);
    else setSent(true);
  }

  async function handleLogout() {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase.auth.signOut();
    if (err) setError(err.message);
    setUserEmail(null);
  }

  return (
    <div className="min-h-svh flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border p-6">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        {userEmail ? (
          <div className="space-y-3">
            <div className="text-sm">Logged in as {userEmail}</div>
            <button onClick={handleLogout} className="w-full bg-black text-white rounded px-3 py-2">
              Log out
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        ) : sent ? (
          <p>Check your email for a magic link.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded px-3 py-2"
            />
            <button type="submit" className="w-full bg-black text-white rounded px-3 py-2">
              Send Magic Link
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}


