"use client";

import { Maximize, Minus, Plus } from "lucide-react";
import { parseChordPro, transposeChordPro } from "@/lib/chordpro";

export function ChordProViewer({
  content,
  semitones = 0,
  fontSize = 22,
  showChords = true,
  controls,
}: {
  content: string;
  semitones?: number;
  fontSize?: number;
  showChords?: boolean;
  controls?: {
    increase: () => void;
    decrease: () => void;
    fullscreen?: () => void;
  };
}) {
  const parsed = parseChordPro(transposeChordPro(content, semitones));

  return (
    <div className="rounded-lg border border-white/10 bg-[#0d0f10] p-4 sm:p-6">
      {controls ? (
        <div className="mb-5 flex flex-wrap gap-2">
          <button title="Disminuir letra" onClick={controls.decrease} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"><Minus size={18} /></button>
          <button title="Aumentar letra" onClick={controls.increase} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"><Plus size={18} /></button>
          {controls.fullscreen ? <button title="Pantalla completa" onClick={controls.fullscreen} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"><Maximize size={18} /></button> : null}
        </div>
      ) : null}
      <div className="space-y-4 font-mono leading-relaxed text-slate-100" style={{ fontSize }}>
        {parsed.map((line, lineIndex) => (
          <div key={`${line.raw}-${lineIndex}`} className="flex flex-wrap items-end gap-x-1 gap-y-2">
            {line.parts.map((part, index) => (
              <span key={`${part.chord}-${part.lyric}-${index}`} className="inline-flex flex-col">
                {showChords && part.chord ? <span className="text-[1.12em] font-bold leading-none text-emerald-300">{part.chord}</span> : null}
                <span className="whitespace-pre-wrap">{part.lyric || " "}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
