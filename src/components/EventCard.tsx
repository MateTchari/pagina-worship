import Link from "next/link";
import { Calendar, Clock, MapPin, Share2 } from "lucide-react";
import type { WorshipEvent } from "@/lib/types";

export function EventCard({ event, muted = false }: { event: WorshipEvent; muted?: boolean }) {
  const songCount = event.event_sections.reduce((total, section) => total + section.event_songs.length, 0);

  return (
    <article className={`rounded-lg border border-white/10 bg-[#171a1d] p-4 shadow-xl shadow-black/10 ${muted ? "opacity-75" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mb-2 inline-flex rounded-md bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-300">{event.type}</p>
          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          {event.description ? <p className="mt-1 text-sm text-slate-400">{event.description}</p> : null}
        </div>
        {event.is_public ? <Share2 className="shrink-0 text-emerald-300" size={18} /> : null}
      </div>
      <div className="mt-4 grid gap-2 text-sm text-slate-300">
        <span className="flex items-center gap-2"><Calendar size={16} />{event.date}</span>
        <span className="flex items-center gap-2"><Clock size={16} />{event.time}</span>
        <span className="flex items-center gap-2"><MapPin size={16} />{event.location}</span>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-sm text-slate-400">{event.event_sections.length} secciones - {songCount} canciones</span>
        <Link href={`/events/${event.id}`} className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-200">
          Abrir
        </Link>
      </div>
    </article>
  );
}
