"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { SearchBar } from "@/components/SearchBar";
import { SongCard } from "@/components/SongCard";
import { SongEditor } from "@/components/SongEditor";
import { TagFilter } from "@/components/TagFilter";
import type { Song, SongCategory } from "@/lib/types";

export function SongsLibraryClient({ initialSongs, canManage }: { initialSongs: Song[]; canManage: boolean }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SongCategory | "Todas">("Todas");
  const [showEditor, setShowEditor] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const songs = useMemo(() => {
    const normalized = query.toLowerCase();
    return initialSongs.filter((song) => {
      const matchesFilter = filter === "Todas" || song.category === filter || song.tags.includes(filter);
      const matchesQuery = [song.title, song.artist, song.category, song.tags.join(" ")].join(" ").toLowerCase().includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [initialSongs, query, filter]);

  return (
    <>
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Biblioteca</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Canciones de casa</h1>
          <p className="mt-2 text-slate-400">La biblioteca de 360 worship: letras, acordes y tonos que el equipo realmente usa.</p>
        </div>
        {canManage ? <button onClick={() => { setEditingSong(null); setShowEditor(!showEditor); }} className="min-h-12 rounded-lg bg-emerald-400 px-4 font-medium text-slate-950">Crear cancion</button> : null}
      </section>
      {canManage && showEditor ? <SongEditor song={editingSong} onDone={() => { setShowEditor(false); setEditingSong(null); }} /> : null}
      <section className="grid gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Buscar una cancion para preparar el set" />
        <TagFilter value={filter} onChange={setFilter} />
      </section>
      {initialSongs.length === 0 ? (
        <EmptyState title="La biblioteca esta lista para empezar">
          {canManage ? "Carga la primera cancion de 360 worship. Una buena lista empieza de a una." : "Cuando los admins carguen canciones, este va a ser el cancionero del equipo."}
        </EmptyState>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              canManage={canManage}
              onEdit={() => {
                setEditingSong(song);
                setShowEditor(true);
              }}
            />
          ))}
        </section>
      )}
    </>
  );
}
