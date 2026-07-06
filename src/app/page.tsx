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
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">360 worship</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">El cancionero interno de 360 worship</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
          Un lugar simple para preparar cada servicio de IBC con orden, unidad y canciones listas para adorar. Cantad a Jehova cantico nuevo - Salmo 96:1.
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
