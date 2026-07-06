import Link from "next/link";
import { BookOpen, CalendarPlus } from "lucide-react";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { EventCard } from "@/components/EventCard";
import { Navbar } from "@/components/Navbar";
import { splitEventsByDate } from "@/lib/event-time";
import { getCurrentUserProfile, getEvents } from "@/lib/queries";

export default async function DashboardPage() {
  const auth = await getCurrentUserProfile();

  if (!auth) {
    redirect("/login");
  }

  const isAdmin = auth.profile?.role === "admin";
  const events = await getEvents();
  const { upcoming, past } = splitEventsByDate(events);
  const latest = upcoming[0] ?? past[0];

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
            <p className="text-sm text-emerald-200">Acceso rapido</p>
            <Link href={`/events/${latest.id}`} className="mt-1 block text-2xl font-semibold text-white hover:text-emerald-200">{latest.title}</Link>
          </section>
        ) : null}

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-white">Proximos eventos</h2>
          {upcoming.length === 0 ? (
            <EmptyState
              title="No hay eventos futuros"
              action={isAdmin ? <Link href="/events/new" className="rounded-lg bg-emerald-400 px-4 py-3 font-medium text-slate-950">Crear evento</Link> : null}
            >
              {isAdmin ? "Cuando cargues un evento futuro, va a aparecer aca." : "Cuando un admin cargue eventos futuros, van a aparecer aca."}
            </EmptyState>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {upcoming.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-white">Eventos pasados</h2>
          {past.length === 0 ? (
            <EmptyState title="Todavia no hay eventos pasados">
              Cuando pase la fecha y hora de un evento, va a aparecer en este historial.
            </EmptyState>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {past.map((event) => <EventCard key={event.id} event={event} muted />)}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
