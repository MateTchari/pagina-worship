"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";

export function KeyTransposeControls({ semitones, setSemitones }: { semitones: number; setSemitones: (value: number) => void }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#171a1d] p-2">
      <button title="Bajar semitono" onClick={() => setSemitones(semitones - 1)} className="rounded-md bg-white/10 p-2 text-white hover:bg-white/20"><Minus size={16} /></button>
      <span className="min-w-20 text-center text-sm font-medium text-slate-200">{semitones > 0 ? `+${semitones}` : semitones} semitonos</span>
      <button title="Subir semitono" onClick={() => setSemitones(semitones + 1)} className="rounded-md bg-white/10 p-2 text-white hover:bg-white/20"><Plus size={16} /></button>
      <button title="Restablecer" onClick={() => setSemitones(0)} className="rounded-md bg-white/10 p-2 text-white hover:bg-white/20"><RotateCcw size={16} /></button>
    </div>
  );
}
