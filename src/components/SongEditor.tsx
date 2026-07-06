"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { createSong, updateSong } from "@/lib/data-actions";
import type { Song, SongCategory } from "@/lib/types";

export function SongEditor({ song, onDone }: { song?: Song | null; onDone?: () => void }) {
  const router = useRouter();
  const isEditing = Boolean(song);
  const [title, setTitle] = useState(song?.title ?? "");
  const [artist, setArtist] = useState(song?.artist ?? "");
  const [key, setKey] = useState(song?.default_key ?? "C");
  const [lyricsAndNotes, setLyricsAndNotes] = useState(song?.lyrics_chords ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !lyricsAndNotes.trim()) {
      setMessage("Completa titulo y letra con notas.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        title: title.trim(),
        artist: artist.trim(),
        category: "Otro" as SongCategory,
        default_key: key.trim() || "C",
        original_key: key.trim() || "C",
        tags: [] as string[],
        lyrics_chords: lyricsAndNotes,
        internal_notes: undefined,
      };

      if (song) {
        await updateSong(song.id, payload);
      } else {
        await createSong(payload);
      }

      if (!song) {
        setTitle("");
        setArtist("");
        setKey("C");
        setLyricsAndNotes("");
      }

      setMessage(song ? "Cancion actualizada." : "Cancion guardada.");
      router.refresh();
      onDone?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar la cancion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-white/10 bg-[#171a1d] p-4">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_120px]">
        <input value={title} onChange={(event) => setTitle(event.target.value)} className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" placeholder="Titulo" required />
        <input value={artist} onChange={(event) => setArtist(event.target.value)} className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" placeholder="Artista" />
        <input value={key} onChange={(event) => setKey(event.target.value)} className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" placeholder="Tono" />
      </div>
      <textarea
        value={lyricsAndNotes}
        onChange={(event) => setLyricsAndNotes(event.target.value)}
        className="min-h-64 rounded-lg border border-white/10 bg-black/20 p-3 font-mono text-white outline-none"
        placeholder={"Letra con acordes y notas\n\nEjemplo:\n[G]Grande es el Senor\n[D]Digno de alabar\n\nNotas: repetir coro dos veces"}
        required
      />
      {message ? <p className="rounded-lg bg-amber-400/10 p-3 text-sm text-amber-100">{message}</p> : null}
      <button disabled={loading} type="submit" className="inline-flex min-h-12 w-fit items-center gap-2 rounded-lg bg-emerald-400 px-4 font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
        <Save size={18} />
        {loading ? "Guardando..." : isEditing ? "Actualizar cancion" : "Guardar cancion"}
      </button>
    </form>
  );
}
