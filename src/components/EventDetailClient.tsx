"use client";

import { useState } from "react";
import { Edit3, ListOrdered } from "lucide-react";
import { EventAdminPanel } from "@/components/EventAdminPanel";
import { EventSection } from "@/components/EventSection";
import { AddSongToEventModal } from "@/components/AddSongToEventModal";
import type { EventSection as EventSectionType, Song, WorshipEvent } from "@/lib/types";

export function EventDetailClient({ event, songs, canManage }: { event: WorshipEvent; songs: Song[]; canManage: boolean }) {
  const [activeSection, setActiveSection] = useState<EventSectionType | null>(null);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);

  return (
    <>
      {canManage ? (
        <div className="flex flex-wrap justify-end gap-2">
          <button onClick={() => setReorderMode(!reorderMode)} className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium hover:bg-white/10 ${reorderMode ? "border-emerald-400 bg-emerald-400/10 text-emerald-100" : "border-white/10 text-white"}`}>
            <ListOrdered size={16} />
            {reorderMode ? "Terminar reordenar" : "Reordenar canciones"}
          </button>
          <button onClick={() => setShowEditPanel(!showEditPanel)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-medium text-white hover:bg-white/10">
            <Edit3 size={16} />
            {showEditPanel ? "Cerrar edicion" : "Editar evento"}
          </button>
        </div>
      ) : null}
      {canManage && showEditPanel ? <EventAdminPanel event={event} /> : null}
      <section className="grid gap-4">
        {event.event_sections.map((section) => (
          <EventSection key={section.id} section={section} canManage={canManage} reorderMode={reorderMode} onAddSong={() => setActiveSection(section)} />
        ))}
      </section>
      <AddSongToEventModal eventId={event.id} section={activeSection} songs={songs} open={Boolean(activeSection)} onClose={() => setActiveSection(null)} />
    </>
  );
}
