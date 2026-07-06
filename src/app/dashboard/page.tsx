import Link from "next/link";
import { BookOpen, CalendarPlus } from "lucide-react";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { EventCard } from "@/components/EventCard";
import { Navbar } from "@/components/Navbar";
import { getCurrentUserProfile, getEvents } from "@/lib/queries";

export default async function DashboardPage() {
  const auth = await getCurrentUserProfile();

  if (!auth) {
    redirect("/login");
  }

  const isAdmin = auth.profile?.role === "admin";
  const events = await getEvents();
  const latest = events[0];

  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6">
        <section className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Panel del equipo</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-5xl">Eventos y canciones en un solo lugar</h1>
            <p className="mt-3 max-w-2xl text-slate-400">Biblioteca propia cargada manualmente, eventos ordenados y modo tocar sin distracciones.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {isAdmin ? <Link href="/events/new" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 font-medium text-slate-950"><CalendarPlus size={19} />Agregar evento</Link> : null}
            <Link href="/songs" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 font-medium text-white"><BookOpen size={19} />Biblioteca</Link>
          </div>
        </section>

        {latest ? (
          <section className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="text-sm text-emerald-200">Acceso rapido al ultimo evento creado</p>
            <Link href={`/events/${latest.id}`} className="mt-1 block text-2xl font-semibold text-white hover:text-emerald-200">{latest.title}</Link>
          </section>
        ) : null}

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-white">Proximos eventos</h2>
          {events.length === 0 ? (
            <EmptyState
              title="Todavia no hay eventos"
              action={isAdmin ? <Link href="/events/new" className="rounded-lg bg-emerald-400 px-4 py-3 font-medium text-slate-950">Crear primer evento</Link> : null}
            >
              {isAdmin ? "Cuando cargues eventos, van a aparecer aca." : "Cuando un admin cargue eventos, van a aparecer aca."}
            </EmptyState>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
