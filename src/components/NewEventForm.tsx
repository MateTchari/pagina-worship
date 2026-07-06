"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/data-actions";
import { defaultSectionsForType } from "@/lib/event-helpers";
import type { EventType } from "@/lib/types";

type EditableSection = {
  id: string;
  name: string;
};

function makeSection(name: string, index: number): EditableSection {
  return {
    id: `section-${index}`,
    name,
  };
}

function initialSections(type: EventType) {
  if (type === "CAMPA") return [makeSection("Plenaria 1", 0)];
  if (type === "OTRO") return [makeSection("Ensayo", 0)];
  return defaultSectionsForType(type).map(makeSection);
}

export function NewEventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<EventType>("VDM");
  const [sections, setSections] = useState<EditableSection[]>(initialSections("VDM"));
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const editableSections = type !== "VDM";

  const cleanSections = useMemo(() => sections.map((section) => section.name.trim()).filter(Boolean), [sections]);

  function changeType(nextType: EventType) {
    setType(nextType);
    setSections(initialSections(nextType));
  }

  function addSection() {
    setSections((current) => [
      ...current,
      {
        id: `section-${Date.now()}-${current.length}`,
        name: type === "CAMPA" ? `Plenaria ${current.length + 1}` : "Nueva seccion",
      },
    ]);
  }

  function updateSection(id: string, value: string) {
    setSections((current) => current.map((section) => section.id === id ? { ...section, name: value } : section));
  }

  function removeSection(id: string) {
    setSections((current) => current.filter((section) => section.id !== id));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !date || !time || !location.trim()) {
      setMessage("Nos falta ubicar el encuentro: titulo, fecha, hora y lugar.");
      return;
    }

    if (cleanSections.length === 0) {
      setMessage("Dale al evento al menos una parte para ordenar el set.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const createdEvent = await createEvent({
        title: title.trim(),
        date,
        time,
        location: location.trim(),
        type,
        description: description.trim() || undefined,
        sections: cleanSections,
      });

      router.push(`/events/${createdEvent.id}`);
      router.refresh();
    } catch (error) {
      const detail = error instanceof Error ? error.message : JSON.stringify(error);
      setMessage(`No pudimos guardar este encuentro todavia: ${detail}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-white/10 bg-[#171a1d] p-4">
      <input value={title} onChange={(event) => setTitle(event.target.value)} className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" placeholder="Titulo del evento" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <input value={date} onChange={(event) => setDate(event.target.value)} type="date" className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" required />
        <input value={time} onChange={(event) => setTime(event.target.value)} type="time" className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" required />
      </div>
      <input value={location} onChange={(event) => setLocation(event.target.value)} className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none" placeholder="Lugar" required />
      <select value={type} onChange={(event) => changeType(event.target.value as EventType)} className="min-h-12 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none">
        <option value="VDM">VDM</option>
        <option value="CAMPA">CAMPA</option>
        <option value="OTRO">OTRO</option>
      </select>
      <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-28 rounded-lg border border-white/10 bg-black/20 p-3 text-white outline-none" placeholder="Descripcion opcional" />
      <div className="rounded-lg bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-300">{type === "CAMPA" ? "Plenarias" : "Secciones iniciales"}</p>
          {editableSections ? (
            <button type="button" onClick={addSection} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">
              <Plus size={16} />
              Agregar
            </button>
          ) : null}
        </div>
        <div className="grid gap-2">
          {sections.map((section) => (
            <div key={section.id} className="flex gap-2">
              <input
                value={section.name}
                onChange={(event) => updateSection(section.id, event.target.value)}
                disabled={!editableSections}
                className="min-h-11 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 text-white outline-none disabled:opacity-70"
              />
              {editableSections ? (
                <button type="button" title="Eliminar" onClick={() => removeSection(section.id)} className="rounded-lg bg-white/10 px-3 text-white hover:bg-white/15">
                  <Trash2 size={17} />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      {message ? <p className="rounded-lg bg-amber-400/10 p-3 text-sm text-amber-100">{message}</p> : null}
      <button disabled={loading} type="submit" className="min-h-12 w-fit rounded-lg bg-emerald-400 px-4 font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? "Guardando..." : "Guardar evento"}
      </button>
    </form>
  );
}
