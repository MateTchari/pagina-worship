"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { addSongToEvent } from "@/lib/data-actions";
import type { EventSection, Song } from "@/lib/types";

export function AddSongToEventModal({
  eventId,
  section,
  songs,
  open,
  onClose,
}: {
  eventId: string;
  section: EventSection | null;
  songs: Song[];
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredSongs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return songs;
    return songs.filter((song) => [song.title, song.artist, song.tags.join(" ")].join(" ").toLowerCase().includes(normalized));
  }, [query, songs]);

  const selectedSongs = useMemo(() => {
    return selectedSongIds
      .map((songId) => songs.find((song) => song.id === songId))
      .filter((song): song is Song => Boolean(song));
  }, [selectedSongIds, songs]);

  function toggleSong(songId: string) {
    setSelectedSongIds((current) => current.includes(songId) ? current.filter((id) => id !== songId) : [...current, songId]);
  }

  function closeAndReset() {
    onClose();
    setQuery("");
    setSelectedSongIds([]);
    setMessage("");
  }

  async function saveSongs() {
    if (!section || selectedSongs.length === 0) return;

    setLoading(true);
    setMessage("");

    try {
      for (const [index, song] of selectedSongs.entries()) {
        await addSongToEvent({
          event_id: eventId,
          section_id: section.id,
          song_id: song.id,
          selected_key: song.default_key,
          order_index: section.event_songs.length + index + 1,
        });
      }

      closeAndReset();
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudieron agregar las canciones.");
    } finally {
      setLoading(false);
    }
  }

  if (!open || !section) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-3xl rounded-lg border border-white/10 bg-[#171a1d] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Agregar canciones</h2>
            <p className="text-sm text-slate-400">{section.name}</p>
          </div>
          <button title="Cerrar" onClick={closeAndReset} className="rounded-lg bg-white/10 p-2 text-white"><X size={18} /></button>
        </div>

        {songs.length === 0 ? (
          <p className="rounded-lg bg-amber-400/10 p-3 text-sm text-amber-100">Primero carga canciones en la biblioteca.</p>
        ) : (
          <div className="grid gap-3">
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-11 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" placeholder="Buscar cancion" />
            <div className="max-h-[52vh] space-y-2 overflow-auto pr-1">
              {filteredSongs.map((song) => {
                const selected = selectedSongIds.includes(song.id);
                return (
                  <button
                    key={song.id}
                    onClick={() => toggleSong(song.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:bg-white/5 ${selected ? "border-emerald-400 bg-emerald-400/10" : "border-white/10"}`}
                  >
                    <span className={`flex size-5 shrink-0 items-center justify-center rounded border ${selected ? "border-emerald-300 bg-emerald-400 text-slate-950" : "border-white/20"}`}>
                      {selected ? "✓" : ""}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium text-white">{song.title}</span>
                      <span className="text-sm text-slate-400">{song.artist} - tono {song.default_key}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {message ? <p className="rounded-lg bg-amber-400/10 p-3 text-sm text-amber-100">{message}</p> : null}
            <div className="flex flex-col justify-between gap-3 border-t border-white/10 pt-3 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-400">{selectedSongIds.length} seleccionadas</p>
              <button disabled={selectedSongIds.length === 0 || loading} onClick={saveSongs} className="min-h-11 rounded-lg bg-emerald-400 px-4 font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? "Agregando..." : `Agregar ${selectedSongIds.length || ""} canciones`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
