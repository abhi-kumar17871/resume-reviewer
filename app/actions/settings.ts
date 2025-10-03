'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function updateNotificationSetting(isEnabled: boolean) {
  const cookieStore = await cookies();

  // Create the Supabase client using the correct @supabase/ssr pattern
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
    return { error: 'You must be logged in to change settings.' };
  }

  // Use the built-in updateUser method to modify the user_metadata
  const { error } = await supabase.auth.updateUser({
    data: { 
      email_notifications_enabled: isEnabled 
    }
  });

  if (error) {
    console.error("Update Error:", error);
    return { error: 'Failed to update your notification settings.' };
  }
  
  revalidatePath('/dashboard/settings');

  return { success: true };
}