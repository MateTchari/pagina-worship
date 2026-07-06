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
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">EVENTOS WORSHIP 360</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">Colosenses 3:23</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
          Trabajen de buena gana en todo lo que hagan, como si fuera para el Señor y no para la gente.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href={auth ? "/dashboard" : "/login"} className="rounded-lg bg-emerald-400 px-5 py-3 font-medium text-slate-950">
            {auth ? "Ir al dashboard" : "Entrar"}
          </Link>
        </div>
      </section>
    </main>
  );
}
