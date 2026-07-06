"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { updateEventSong } from "@/lib/data-actions";

export function EventSongKeyEditor({ eventSongId, initialKey }: { eventSongId: string; initialKey: string }) {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState(initialKey);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function saveKey() {
    if (!selectedKey.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      await updateEventSong(eventSongId, { selected_key: selectedKey.trim() });
      setMessage("Guardado");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        value={selectedKey}
        onChange={(event) => setSelectedKey(event.target.value)}
        className="min-h-10 w-24 rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none"
        placeholder="Tono"
      />
      <button disabled={loading || selectedKey.trim() === initialKey} onClick={saveKey} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-400 px-3 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
        <Save size={15} />
        Guardar
      </button>
      {message ? <span className="text-xs text-emerald-200">{message}</span> : null}
    </div>
  );
}
