"use client";

import type { SongCategory } from "@/lib/types";

export const categoryFilters: Array<SongCategory | "Todas"> = ["Todas", "Alabanza", "Adoracion", "Rapida", "Lenta", "Ministracion", "Santa Cena", "Ofrenda", "Juvenil", "Otro"];

export function TagFilter({ value, onChange }: { value: SongCategory | "Todas"; onChange: (value: SongCategory | "Todas") => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categoryFilters.map((filter) => (
        <button key={filter} onClick={() => onChange(filter)} className={`min-h-10 shrink-0 rounded-lg px-3 text-sm transition ${value === filter ? "bg-emerald-400 text-slate-950" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>
          {filter}
        </button>
      ))}
    </div>
  );
}
