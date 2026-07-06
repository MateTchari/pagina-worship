import Link from "next/link";
import { Play } from "lucide-react";
import { EventSection } from "@/components/EventSection";
import { getEventById } from "@/lib/queries";

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event || !event.is_public) {
    return <main className="grid min-h-screen place-items-center bg-[#101214] px-4 text-center text-white">Este link no esta disponible. Si es un evento de IBC, pedile al equipo que lo comparta de nuevo.</main>;
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6">
      <section className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Evento compartido</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{event.title}</h1>
          <p className="mt-2 text-slate-400">{event.date} - {event.time} - {event.location}</p>
        </div>
        <Link href={`/events/${event.id}/play`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 font-medium text-slate-950"><Play size={18} />Modo tocar</Link>
      </section>
      {event.event_sections.map((section) => <EventSection key={section.id} section={section} />)}
    </main>
  );
}
