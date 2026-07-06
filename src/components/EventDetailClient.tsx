"use client";

import { useState } from "react";
import { Edit3 } from "lucide-react";
import { EventAdminPanel } from "@/components/EventAdminPanel";
import { EventSection } from "@/components/EventSection";
import { AddSongToEventModal } from "@/components/AddSongToEventModal";
import type { EventSection as EventSectionType, Song, WorshipEvent } from "@/lib/types";

export function EventDetailClient({ event, songs, canManage }: { event: WorshipEvent; songs: Song[]; canManage: boolean }) {
  const [activeSection, setActiveSection] = useState<EventSectionType | null>(null);
  const [showEditPanel, setShowEditPanel] = useState(false);

  return (
    <>
      {canManage ? (
        <div className="flex justify-end">
          <button onClick={() => setShowEditPanel(!showEditPanel)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-medium text-white hover:bg-white/10">
            <Edit3 size={16} />
            {showEditPanel ? "Cerrar edicion" : "Editar evento"}
          </button>
        </div>
      ) : null}
      {canManage && showEditPanel ? <EventAdminPanel event={event} /> : null}
      <section className="grid gap-4">
        {event.event_sections.map((section) => (
          <EventSection key={section.id} section={section} canManage={canManage} onAddSong={() => setActiveSection(section)} />
        ))}
      </section>
      <AddSongToEventModal eventId={event.id} section={activeSection} songs={songs} open={Boolean(activeSection)} onClose={() => setActiveSection(null)} />
    </>
  );
}
