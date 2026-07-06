import { redirect } from "next/navigation";
import { SupabaseAuthPanel } from "@/components/SupabaseAuthPanel";
import { getCurrentUserProfile } from "@/lib/queries";

export default async function LoginPage() {
  const auth = await getCurrentUserProfile();

  if (auth) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#101214] px-4">
      <section className="w-full">
        <div className="mx-auto mb-8 max-w-md text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">360 worship</p>
          <h1 className="text-3xl font-semibold text-white">Entrar al cancionero interno</h1>
          <p className="mt-3 text-slate-400">Login con Supabase Auth para admins y musicos del equipo.</p>
        </div>
        <SupabaseAuthPanel />
      </section>
    </main>
  );
}
