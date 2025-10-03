'use server';

import { createClient } from '@supabase/supabase-js';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/auth/admin';

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

export async function getResumesWithEmails() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user.email)) {
    return { error: 'Unauthorized' };
  }

  const { data: rows, error } = await supabase
    .from('resumes')
    .select('id, user_id, created_at, status, score, notes, file_path')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching resumes:', error);
    return { error: error.message };
  }

  const resumesWithEmails = await Promise.all(
    (rows || []).map(async (row) => ({
      ...row,
      email: await getUserEmail(row.user_id),
    }))
  );

  return { resumes: resumesWithEmails };
}