import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Redirect to the dashboard after successful authentication
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If there's an error or no code, redirect to an error page
  console.error('Error in auth callback:', 'Could not exchange code for session');
  const errorUrl = new URL('/login?error=Authentication failed. Please try again.', request.url);
  return NextResponse.redirect(errorUrl);
}