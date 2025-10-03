'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSignedUrl(filePath: string): Promise<{ signedUrl: string } | { error: string }> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to view resumes.' };
  }

  const { data, error } = await supabase.storage
    .from('resumes')
    .createSignedUrl(filePath, 60 * 5);

  if (error) {
    console.error("Signed URL Error:", error);
    return { error: 'Could not create a secure link for the resume.' };
  }
  
  return { signedUrl: data.signedUrl };
}