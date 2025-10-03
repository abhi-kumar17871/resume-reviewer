import { cookies as nextCookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase env vars");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async get(name) {
        const store = await (nextCookies as unknown as () => Promise<any>)();
        return store.get(name)?.value;
      },
      async set(name, value, options) {
        try {
          const store = await (nextCookies as unknown as () => Promise<any>)();
          store.set({ name, value, ...options });
        } catch {}
      },
      async remove(name, options) {
        try {
          const store = await (nextCookies as unknown as () => Promise<any>)();
          // Prefer delete; fallback to setting empty value if delete not available
          if (typeof store.delete === "function") {
            store.delete({ name, ...options });
          } else {
            store.set({ name, value: "", ...options });
          }
        } catch {}
      },
    },
  });
}


