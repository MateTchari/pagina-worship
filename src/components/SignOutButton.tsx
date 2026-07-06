"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10">
      <LogOut size={17} />
      Salir
    </button>
  );
}
