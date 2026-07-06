import Link from "next/link";
import { Play } from "lucide-react";
import { redirect } from "next/navigation";
import { EventDetailClient } from "@/components/EventDetailClient";
import { Navbar } from "@/components/Navbar";
import { getCurrentUserProfile, getEventById, getSongs } from "@/lib/queries";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await getCurrentUserProfile();

  if (!auth) {
    redirect("/login");
  }

  const { id } = await params;
  const event = await getEventById(id);
  const canManage = auth.profile?.role === "admin";
  const songs = canManage ? await getSongs() : [];

  if (!event) {
    return <main className="grid min-h-screen place-items-center bg-[#101214] text-white">Evento no encontrado.</main>;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6">
        <section className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">{event.type}</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-5xl">{event.title}</h1>
            <p className="mt-3 text-slate-400">{event.date} - {event.time} - {event.location}</p>
            {event.description ? <p className="mt-2 max-w-2xl text-slate-400">{event.description}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/events/${event.id}/play`} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-emerald-400 px-4 font-medium text-slate-950"><Play size={18} />Modo tocar</Link>
          </div>
        </section>
        <EventDetailClient event={event} songs={songs} canManage={canManage} />
      </main>
    </>
  );
}
