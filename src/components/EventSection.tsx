import { GripVertical, Music2, Plus } from "lucide-react";
import { EventSongKeyEditor } from "@/components/EventSongKeyEditor";
import { EventSongReorderControls } from "@/components/EventSongReorderControls";
import type { EventSection as EventSectionType } from "@/lib/types";

export function EventSection({ section, canManage = false, reorderMode = false, onAddSong }: { section: EventSectionType; canManage?: boolean; reorderMode?: boolean; onAddSong?: () => void }) {
  const sortedSongs = [...section.event_songs].sort((a, b) => a.order_index - b.order_index);

  return (
    <section className="rounded-lg border border-white/10 bg-[#171a1d]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          {canManage ? <GripVertical size={18} className="text-slate-500" /> : null}
          <div>
            <h2 className="text-xl font-semibold text-white">{section.name}</h2>
            <p className="text-sm text-slate-400">{section.event_songs.length} canciones</p>
          </div>
        </div>
        {canManage ? (
          <button onClick={onAddSong} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-3 py-2 text-sm font-medium text-slate-950">
            <Plus size={16} />
            Agregar cancion
          </button>
        ) : null}
      </div>
      <div className="divide-y divide-white/10">
        {sortedSongs.length ? sortedSongs.map((eventSong, index) => (
          <div key={eventSong.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md bg-white/10 text-sm text-slate-300">{eventSong.order_index}</span>
              {canManage && reorderMode ? (
                <EventSongReorderControls
                  currentIndex={index}
                  songs={sortedSongs.map((song) => ({ id: song.id, order_index: song.order_index }))}
                />
              ) : null}
              <div>
                <h3 className="font-semibold text-white">{eventSong.song.title}</h3>
                <p className="text-sm text-slate-400">{eventSong.song.artist}</p>
                {eventSong.event_notes ? <p className="mt-2 text-sm text-amber-100">{eventSong.event_notes}</p> : null}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-slate-300 sm:items-end">
              <div className="flex items-center gap-2">
                <Music2 size={16} />
                Tono {eventSong.selected_key}
              </div>
              {canManage ? <EventSongKeyEditor eventSongId={eventSong.id} initialKey={eventSong.selected_key} /> : null}
            </div>
          </div>
        )) : (
          <div className="p-5 text-sm text-slate-400">Todavia no hay canciones en esta seccion.</div>
        )}
      </div>
    </section>
  );
}
