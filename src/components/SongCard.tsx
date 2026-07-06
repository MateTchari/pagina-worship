import { Edit3, Music, Tag } from "lucide-react";
import type { Song } from "@/lib/types";

export function SongCard({ song, canManage = false, onEdit }: { song: Song; canManage?: boolean; onEdit?: () => void }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#171a1d] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{song.title}</h3>
          <p className="text-sm text-slate-400">{song.artist}</p>
        </div>
        <span className="rounded-md bg-sky-400/10 px-2 py-1 text-xs font-medium text-sky-200">{song.category}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1"><Music size={13} />{song.default_key}</span>
        {song.bpm ? <span className="rounded-md bg-white/5 px-2 py-1">{song.bpm} BPM</span> : null}
        {song.time_signature ? <span className="rounded-md bg-white/5 px-2 py-1">{song.time_signature}</span> : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {song.tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400">
            <Tag size={12} />
            {tag}
          </span>
        ))}
      </div>
      {canManage ? (
        <button onClick={onEdit} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-medium text-white hover:bg-white/10">
          <Edit3 size={16} />
          Editar
        </button>
      ) : null}
    </article>
  );
}
