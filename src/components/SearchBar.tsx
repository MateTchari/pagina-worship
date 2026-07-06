"use client";

import { Search } from "lucide-react";

export function SearchBar({ value, onChange, placeholder = "Buscar" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="flex min-h-12 items-center gap-2 rounded-lg border border-white/10 bg-[#171a1d] px-3 text-slate-300">
      <Search size={18} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full bg-transparent text-base text-white outline-none placeholder:text-slate-500" />
    </label>
  );
}
