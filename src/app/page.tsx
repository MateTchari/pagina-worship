import Link from "next/link";
import { Music2 } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/queries";

export default async function Home() {
  const auth = await getCurrentUserProfile();

  return (
    <main className="grid min-h-screen place-items-center bg-[#101214] px-4 text-white">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
          <Music2 size={32} />
        </div>
        <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">WORSHIP 360</h1>
        <div className="mt-8 flex justify-center">
          <Link href={auth ? "/dashboard" : "/login"} className="rounded-lg bg-emerald-400 px-5 py-3 font-medium text-slate-950">
            {auth ? "Ir al dashboard" : "Entrar"}
          </Link>
        </div>
      </section>
    </main>
  );
}
