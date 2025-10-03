import { cookies as nextCookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieStore = {
  get: (name: string) => { value: string | undefined } | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  delete: (name: string, options: CookieOptions) => void;
};

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase env vars");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async get(name: string) {
        const store = await (nextCookies as unknown as () => Promise<CookieStore>)();
        return store.get(name)?.value;
      },
      async set(name, value, options) {
        try {
          const store = await (nextCookies as unknown as () => Promise<CookieStore>)();
          store.set(name, value, options);
        } catch {}
      },
      async remove(name, options) {
        try {
          const store = await (nextCookies as unknown as () => Promise<CookieStore>)();
          store.delete(name, options);
        } catch {}
      },
    },
  });
}