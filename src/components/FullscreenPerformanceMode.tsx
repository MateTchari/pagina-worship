"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Maximize, Minus, Music2, Play, Plus, RotateCcw } from "lucide-react";
import type { WorshipEvent } from "@/lib/types";
import { ChordProViewer } from "@/components/ChordProViewer";
import { semitoneDistance, transposeChord } from "@/lib/chordpro";

const performanceFontSizeKey = "360-worship-performance-font-size";
const minFontSize = 10;
const maxFontSize = 64;
const defaultFontSize = 28;
const fontStep = 5;

function clampFontSize(value: number) {
  return Math.min(maxFontSize, Math.max(minFontSize, value));
}

function getInitialFontSize() {
  if (typeof window === "undefined") return defaultFontSize;

  const savedFontSize = window.localStorage.getItem(performanceFontSizeKey);
  if (!savedFontSize) return defaultFontSize;

  const parsedFontSize = Number(savedFontSize);
  return Number.isFinite(parsedFontSize) ? clampFontSize(parsedFontSize) : defaultFontSize;
}

export function FullscreenPerformanceMode({ event }: { event: WorshipEvent }) {
  const songs = useMemo(() => event.event_sections.flatMap((section) => section.event_songs.map((eventSong) => ({ ...eventSong, sectionName: section.name }))), [event]);
  const [index, setIndex] = useState(0);
  const [fontSize, setFontSize] = useState(getInitialFontSize);
  const [showChords, setShowChords] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);
  const [songKeyShifts, setSongKeyShifts] = useState<Record<string, number>>({});
  const active = songs[index];
  const visualKeyShift = active ? songKeyShifts[active.id] ?? 0 : 0;
  const semitones = active ? semitoneDistance(active.song.default_key, active.selected_key) + visualKeyShift : 0;
  const currentKey = active ? transposeChord(active.selected_key, visualKeyShift) : "";
  useEffect(() => {
    window.localStorage.setItem(performanceFontSizeKey, String(fontSize));
  }, [fontSize]);

  function requestFullscreen() {
    document.documentElement.requestFullscreen?.();
  }

  function changeActiveSongKey(delta: number) {
    if (!active) return;
    setSongKeyShifts((current) => ({
      ...current,
      [active.id]: (current[active.id] ?? 0) + delta,
    }));
  }

  function resetActiveSongKey() {
    if (!active) return;
    setSongKeyShifts((current) => ({
      ...current,
      [active.id]: 0,
    }));
  }

  return (
    <main className="min-h-screen bg-[#070808] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-sm text-emerald-300">{event.title} - {active?.sectionName}</p>
            <h1 className="text-2xl font-semibold sm:text-4xl">{active?.song.title ?? "Sin canciones"}</h1>
            {active ? <p className="mt-1 text-slate-400">Tono {currentKey} - {active.song.artist}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button title="Cancion anterior" onClick={() => setIndex(Math.max(0, index - 1))} className="rounded-lg bg-white/10 p-3 hover:bg-white/20"><ChevronLeft size={20} /></button>
            <button title="Siguiente cancion" onClick={() => setIndex(Math.min(songs.length - 1, index + 1))} className="rounded-lg bg-white/10 p-3 hover:bg-white/20"><ChevronRight size={20} /></button>
            <div className="inline-flex items-center rounded-lg border border-white/10 bg-white/5">
              <button title="Bajar tono" onClick={() => changeActiveSongKey(-1)} className="p-3 hover:bg-white/10"><Minus size={20} /></button>
              <span className="inline-flex min-w-24 items-center justify-center gap-2 px-2 text-sm font-semibold text-emerald-200">
                <Music2 size={16} />
                {currentKey || "-"}
              </span>
              <button title="Subir tono" onClick={() => changeActiveSongKey(1)} className="p-3 hover:bg-white/10"><Plus size={20} /></button>
              <button title="Volver al tono del evento" onClick={resetActiveSongKey} className="border-l border-white/10 p-3 hover:bg-white/10"><RotateCcw size={18} /></button>
            </div>
            <button title="Disminuir letra" onClick={() => setFontSize((current) => clampFontSize(current - fontStep))} className="rounded-lg bg-white/10 p-3 hover:bg-white/20"><Minus size={20} /></button>
            <button title="Aumentar letra" onClick={() => setFontSize((current) => clampFontSize(current + fontStep))} className="rounded-lg bg-white/10 p-3 hover:bg-white/20"><Plus size={20} /></button>
            <button title="Mostrar u ocultar acordes" onClick={() => setShowChords(!showChords)} className="rounded-lg bg-white/10 p-3 hover:bg-white/20">{showChords ? <Eye size={20} /> : <EyeOff size={20} />}</button>
            <button title="Scroll automatico" onClick={() => setAutoScroll(!autoScroll)} className={`rounded-lg p-3 hover:bg-white/20 ${autoScroll ? "bg-emerald-400 text-slate-950" : "bg-white/10"}`}><Play size={20} /></button>
            <button title="Pantalla completa" onClick={requestFullscreen} className="rounded-lg bg-white/10 p-3 hover:bg-white/20"><Maximize size={20} /></button>
          </div>
        </div>
        <div className={autoScroll ? "animate-[scrollSlow_50s_linear_infinite]" : ""}>
          {active ? <ChordProViewer content={active.song.lyrics_chords} semitones={semitones} fontSize={fontSize} showChords={showChords} columns={2} /> : <p className="text-slate-400">Este evento no tiene canciones.</p>}
        </div>
      </div>
    </main>
  );
}
