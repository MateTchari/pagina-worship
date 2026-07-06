"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Maximize, Minus, Play, Plus } from "lucide-react";
import type { WorshipEvent } from "@/lib/types";
import { ChordProViewer } from "@/components/ChordProViewer";
import { semitoneDistance } from "@/lib/chordpro";

export function FullscreenPerformanceMode({ event }: { event: WorshipEvent }) {
  const songs = useMemo(() => event.event_sections.flatMap((section) => section.event_songs.map((eventSong) => ({ ...eventSong, sectionName: section.name }))), [event]);
  const [index, setIndex] = useState(0);
  const [fontSize, setFontSize] = useState(28);
  const [showChords, setShowChords] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);
  const active = songs[index];
  const semitones = active ? semitoneDistance(active.song.default_key, active.selected_key) : 0;

  function requestFullscreen() {
    document.documentElement.requestFullscreen?.();
  }

  return (
    <main className="min-h-screen bg-[#070808] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-5 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-sm text-emerald-300">{event.title} · {active?.sectionName}</p>
            <h1 className="text-2xl font-semibold sm:text-4xl">{active?.song.title ?? "Sin canciones"}</h1>
            {active ? <p className="mt-1 text-slate-400">Tono {active.selected_key} · {active.song.artist}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button title="Canción anterior" onClick={() => setIndex(Math.max(0, index - 1))} className="rounded-lg bg-white/10 p-3 hover:bg-white/20"><ChevronLeft size={20} /></button>
            <button title="Siguiente canción" onClick={() => setIndex(Math.min(songs.length - 1, index + 1))} className="rounded-lg bg-white/10 p-3 hover:bg-white/20"><ChevronRight size={20} /></button>
            <button title="Disminuir letra" onClick={() => setFontSize(Math.max(18, fontSize - 2))} className="rounded-lg bg-white/10 p-3 hover:bg-white/20"><Minus size={20} /></button>
            <button title="Aumentar letra" onClick={() => setFontSize(Math.min(48, fontSize + 2))} className="rounded-lg bg-white/10 p-3 hover:bg-white/20"><Plus size={20} /></button>
            <button title="Mostrar u ocultar acordes" onClick={() => setShowChords(!showChords)} className="rounded-lg bg-white/10 p-3 hover:bg-white/20">{showChords ? <Eye size={20} /> : <EyeOff size={20} />}</button>
            <button title="Scroll automático" onClick={() => setAutoScroll(!autoScroll)} className={`rounded-lg p-3 hover:bg-white/20 ${autoScroll ? "bg-emerald-400 text-slate-950" : "bg-white/10"}`}><Play size={20} /></button>
            <button title="Pantalla completa" onClick={requestFullscreen} className="rounded-lg bg-white/10 p-3 hover:bg-white/20"><Maximize size={20} /></button>
          </div>
        </div>
        <div className={autoScroll ? "animate-[scrollSlow_50s_linear_infinite]" : ""}>
          {active ? <ChordProViewer content={active.song.lyrics_chords} semitones={semitones} fontSize={fontSize} showChords={showChords} /> : <p className="text-slate-400">Este evento no tiene canciones.</p>}
        </div>
      </div>
    </main>
  );
}
