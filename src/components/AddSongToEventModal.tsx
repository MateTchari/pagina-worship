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
  const [selectedSongId, setSelectedSongId] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [eventNotes, setEventNotes] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedSong = songs.find((song) => song.id === selectedSongId);

  const filteredSongs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return songs;
    return songs.filter((song) => [song.title, song.artist, song.tags.join(" ")].join(" ").toLowerCase().includes(normalized));
  }, [query, songs]);

  async function saveSong() {
    if (!section || !selectedSong) return;

    setLoading(true);
    setMessage("");

    try {
      await addSongToEvent({
        event_id: eventId,
        section_id: section.id,
        song_id: selectedSong.id,
        selected_key: selectedKey.trim() || selectedSong.default_key,
        order_index: section.event_songs.length + 1,
        event_notes: eventNotes.trim() || undefined,
      });

      onClose();
      setQuery("");
      setSelectedSongId("");
      setSelectedKey("");
      setEventNotes("");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo agregar la cancion.");
    } finally {
      setLoading(false);
    }
  }

  if (!open || !section) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#171a1d] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Agregar cancion</h2>
            <p className="text-sm text-slate-400">{section.name}</p>
          </div>
          <button title="Cerrar" onClick={onClose} className="rounded-lg bg-white/10 p-2 text-white"><X size={18} /></button>
        </div>

        {songs.length === 0 ? (
          <p className="rounded-lg bg-amber-400/10 p-3 text-sm text-amber-100">Primero carga canciones en la biblioteca.</p>
        ) : (
          <div className="grid gap-3">
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-11 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" placeholder="Buscar cancion" />
            <div className="max-h-52 space-y-2 overflow-auto">
              {filteredSongs.map((song) => (
                <button
                  key={song.id}
                  onClick={() => {
                    setSelectedSongId(song.id);
                    setSelectedKey(song.default_key);
                  }}
                  className={`w-full rounded-lg border p-3 text-left hover:bg-white/5 ${selectedSongId === song.id ? "border-emerald-400 bg-emerald-400/10" : "border-white/10"}`}
                >
                  <span className="block font-medium text-white">{song.title}</span>
                  <span className="text-sm text-slate-400">{song.artist} - tono {song.default_key}</span>
                </button>
              ))}
            </div>
            <input value={selectedKey} onChange={(event) => setSelectedKey(event.target.value)} className="min-h-11 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" placeholder="Tono para este evento" />
            <textarea value={eventNotes} onChange={(event) => setEventNotes(event.target.value)} className="min-h-24 rounded-lg border border-white/10 bg-black/20 p-3 text-white outline-none" placeholder="Notas especificas para este evento" />
            {message ? <p className="rounded-lg bg-amber-400/10 p-3 text-sm text-amber-100">{message}</p> : null}
            <button disabled={!selectedSongId || loading} onClick={saveSong} className="min-h-11 rounded-lg bg-emerald-400 px-4 font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Agregando..." : "Agregar a la seccion"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
