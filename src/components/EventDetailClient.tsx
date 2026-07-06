"use client";

import { useState } from "react";
import { EventSection } from "@/components/EventSection";
import { AddSongToEventModal } from "@/components/AddSongToEventModal";
import type { EventSection as EventSectionType, Song, WorshipEvent } from "@/lib/types";

export function EventDetailClient({ event, songs, canManage }: { event: WorshipEvent; songs: Song[]; canManage: boolean }) {
  const [activeSection, setActiveSection] = useState<EventSectionType | null>(null);

  return (
    <>
      <section className="grid gap-4">
        {event.event_sections.map((section) => (
          <EventSection key={section.id} section={section} canManage={canManage} onAddSong={() => setActiveSection(section)} />
        ))}
      </section>
      <AddSongToEventModal eventId={event.id} section={activeSection} songs={songs} open={Boolean(activeSection)} onClose={() => setActiveSection(null)} />
    </>
  );
}
