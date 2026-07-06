"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { reorderSongs } from "@/lib/data-actions";

export function EventSongReorderControls({
  currentIndex,
  songs,
}: {
  currentIndex: number;
  songs: Array<{ id: string; order_index: number }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function move(direction: -1 | 1) {
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= songs.length) return;

    const nextSongs = [...songs];
    const currentSong = nextSongs[currentIndex];
    const targetSong = nextSongs[targetIndex];
    nextSongs[currentIndex] = targetSong;
    nextSongs[targetIndex] = currentSong;

    setLoading(true);
    try {
      await reorderSongs(nextSongs.map((song, index) => ({ id: song.id, order_index: index + 1 })));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button disabled={loading || currentIndex === 0} title="Subir" onClick={() => move(-1)} className="rounded-md bg-white/10 p-1.5 text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40">
        <ArrowUp size={15} />
      </button>
      <button disabled={loading || currentIndex === songs.length - 1} title="Bajar" onClick={() => move(1)} className="rounded-md bg-white/10 p-1.5 text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40">
        <ArrowDown size={15} />
      </button>
    </div>
  );
}
